// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 21/02/2025

"use strict";

const { processError } = require("./utils/errors");
const { check_TCP_PORT, test_IP, } = require("./utils/TCP");
const { check_UDP_PORT } = require("./utils/UDP");
const { resolveHostname } = require("./utils/dns");
const { identifyNetwork } = require("./utils/network");

const packageJson = require("../package.json");
const supportedSchemas = new Set(['TCP', 'UDP']);

/**
 * Scans and checks a host's port.
 * 
 * @param {Object} inputObject - The object containing the scan info.
 * @returns {Promise} - returns whether the port is available or not.
 */
const checkPort = async (inputObject) => {
    const host = inputObject.host || "127.0.0.1";
    const port = inputObject.port;
    const type = inputObject.type || "TCP";
    const timeout = inputObject.timeout;

    // Validate the host using net module
    if (!host || typeof host !== 'string') {
        const customError = 'ERR_INVALID_HOST';
        return await processError(customError, false, false, type, host, port);
    }

    // Validate whether it has supported protocol or not.
    if (!supportedSchemas.has(type)) {
        const customError = 'ERR_TYPE';
        return await processError(customError, false, false, type, host, port);
    }

    if (type === 'TCP') {
        return await check_TCP_PORT(host, port, timeout);
    } else if (type === 'UDP') {
        return await check_UDP_PORT(host, port, timeout);
    } else {
        return;
    }
}

/**
 * Scans ports using a sliding window for maximum efficiency.
 */
const checkPorts = async (inputObject) => {
    const {
        host = "127.0.0.1",
        from: start,
        to: end,
        type = "TCP",
        timeout,
        maxConcurrency = 100
    } = inputObject;

    // Validation
    if (!host || typeof host !== 'string') return processError('ERR_INVALID_HOST', false, false, type, host, `${start}-${end}`);
    if (!supportedSchemas.has(type)) return processError('ERR_TYPE', false, false, type, host, `range ${start}-${end}`);

    const results = [];
    const checker = type === 'TCP' ? check_TCP_PORT : check_UDP_PORT;
    
    let currentPort = start;
    const activePromises = new Set();

    // Run a single scan and then immediately start the next one when it finishes, ensuring we never exceed maxConcurrency
    const runNext = async () => {
        if (currentPort > end) return;

        const port = currentPort++;
        const promise = checker(host, port, timeout)
            .then(res => ({ port, success: res.success, message: res.message }))
            .catch(err => ({ port, success: false, message: err.message }));

        activePromises.add(promise);
        
        // When the promise resolves, store the result and start the next scan
        const result = await promise;
        results.push(result);
        activePromises.delete(promise);
        
        await runNext();
    };

    // Initial batch up to maxConcurrency
    const initialBatch = [];
    for (let i = 0; i < Math.min(maxConcurrency, end - start + 1); i++) {
        initialBatch.push(runNext());
    }

    await Promise.all(initialBatch);
    
    // Sort results by port number before returning (since they finish out of order)
    return results.sort((a, b) => a.port - b.port);
};

/**
 * Check the type of ip address entered.
 * 
 * @param {string} ip - The ip address.
 * @returns {Object} - Returns the the ip address type as an object.
 */
const check_IP = (ip) => {
    return test_IP(ip);
}

/**
 * Resolves a port number to its common service name.
 * @param {number} port 
 * @returns {string} - The service name or 'unknown'
 */
const getServiceName = (port) => {
    const commonPorts = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        3306: "MySQL",
        5432: "PostgreSQL",
        8080: "HTTP-Proxy"
    };
    return commonPorts[port] || "unknown";
};

/**
 * @returns {Object} Returns a object which contains some info regarding netport.js.
 */

const ABOUT = Object.freeze({
    get value() {
        if (!packageJson) throw new Error(`package.json files seems to be missing!\nPlease try again by downloading 'netport' again with the following command\n''npm i netport''\nin your terminal!`);
        const aboutObject = {
            "Name": packageJson.name,
            "Author": packageJson.author,
            "Version": packageJson.version,
            "Description": packageJson.description,
            "Respository": packageJson.repository
        };
        return aboutObject;
    }
}).value;

/**
 * 
 * @returns {string} returns the package version
 */

const VERSION = Object.freeze({
    get value() {
        if (!packageJson) throw new Error(`package.json files seems to be missing!\nPlease try again by downloading 'netport' again with the following command\n''npm i netport''\nin your terminal!`);
        return packageJson.version;
    }
}).value;

module.exports = {
    scanPort: (inputObject) => checkPort(inputObject),
    scanPorts: (inputObject) => checkPorts(inputObject),
    check_IP,
    getServiceName,
    resolveHostname,
    discoverLocalDevices: (options) => identifyNetwork(options),
    ABOUT,
    VERSION
}
