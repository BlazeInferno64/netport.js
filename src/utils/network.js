// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 28/02/2026


"use strict";

const net = require("net");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);


const getLocalSubnet = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address.split('.').slice(0, 3).join('.');
            }
        }
    }
    return '127.0.0.1';
};

const detectOSByTTL = (ttl) => {
    if (ttl <= 64) return "Linux/Unix/macOS/Mobile";
    if (ttl <= 128) return "Windows";
    if (ttl <= 255) return "Network Device (Router/Switch)";
    return "Unknown";
};

/**
 * Connects to a port and waits for a string response (Banner)
 */
const grabBanner = (host, port, timeout = 1500) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let dataBuffer = "";

        const timer = setTimeout(() => {
            socket.destroy();
            resolve("");
        }, timeout);

        socket.once("connect", () => {
            socket.write("\r\n"); // Poke the service to elicit a banner
        });

        socket.on("data", (data) => {
            dataBuffer += data.toString().trim();
            socket.destroy();
        });

        socket.on("error", () => resolve(""));
        socket.on("close", () => {
            clearTimeout(timer);
            resolve(dataBuffer);
        });

        socket.connect(port, host);
    });
};

/** --- The Core "Detective" Logic --- **/

const fingerprintHost = async (host, ttl) => {
    const commonPorts = { 22: "SSH", 80: "HTTP", 443: "HTTPS", 445: "SMB", 3389: "RDP" };
    const banners = {};
    const details = [];
    let confidence = 10; // Base confidence from TTL

    // Concurrent Banner Grabbing
    await Promise.all(Object.entries(commonPorts).map(async ([port, service]) => {
        const banner = await grabBanner(host, parseInt(port));
        if (banner) banners[service] = banner;
    }));

    // Logic Analysis (SSH)
    if (banners.SSH) {
        const ssh = banners.SSH.toLowerCase();
        confidence += 30;
        if (ssh.includes("ubuntu")) details.push("Ubuntu Linux");
        else if (ssh.includes("debian")) details.push("Debian Linux");
        else details.push("Linux (OpenSSH)");
    }

    // Logic Analysis (HTTP/IIS)
    if (banners.HTTP || banners.HTTPS) {
        const web = (banners.HTTP || banners.HTTPS).toLowerCase();
        if (web.includes("iis")) {
            details.push("Windows Server (IIS)");
            confidence += 40;
        }
    }

    // Port patterns
    if (banners.SMB || banners.RDP) {
        details.push("Windows Device (SMB/RDP active)");
        confidence += 20;
    }

    //const finalOS = details[0] || detectOSByTTL(ttl);
    //const displayOS = confidence <= 10 ? `${finalOS} (Guessed)` : finalOS;

    return {
        ip: host,
        os: details[0] || detectOSByTTL(ttl),
        confidence: Math.min(confidence, 100),
        services: Object.keys(banners),
        banners: banners
    };
};


const identifyNetwork = async (options = {}) => {
    const subnet = getLocalSubnet();
    const maxConcurrency = options.maxConcurrency || 50;
    const timeout = options.timeout || 1000;

    const results = [];
    let currentIdx = 1;

    const isWindows = process.platform === 'win32';
    const getPingCmd = (host) => isWindows
        ? `ping -n 1 -w ${timeout} ${host}`
        : `ping -c 1 -W ${timeout} ${host}`;

    const runWorker = async () => {
        while (currentIdx <= 254) {
            const host = `${subnet}.${currentIdx++}`;
            try {
                const { stdout } = await execPromise(getPingCmd(host));
                const ttlMatch = stdout.match(/ttl=(\d+)/i);

                if (ttlMatch) {
                    const ttl = parseInt(ttlMatch[1], 10);
                    // Pass the discovered host to the Detective
                    const identity = await fingerprintHost(host, ttl);
                    results.push(identity);
                }
            } catch (e) { /* Host is down, skip */ }
        }
    };

    const workers = Array(Math.min(maxConcurrency, 50)).fill(null).map(() => runWorker());
    await Promise.all(workers);

    return results.sort((a, b) => {
        return parseInt(a.ip.split('.').pop()) - parseInt(b.ip.split('.').pop());
    });
};

module.exports = {
    identifyNetwork
};