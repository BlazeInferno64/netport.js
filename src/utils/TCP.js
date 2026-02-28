// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 28/02/2026

"use strict";

const net = require("net");
const { processError } = require("./errors");


const check_TCP_PORT = (host = '127.0.0.1', port, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.on("connect", () => {
            socket.end(); // Gracefully close the connection
            socket.unref(); // Allow the process to exit
            return resolve({
                success: true,
                message: `TCP port ${port} is open on ${host}`,
                port: port
            });
        });

        socket.on("error", (err) => {
            socket.destroy(); // Forcefully close the socket on error
            //socket.unref(); // Allow the process to exit
            if (err.code === 'ECONNREFUSED') {
                return resolve({
                    success: false,
                    message: `TCP port ${port} is closed on ${host}`,
                    port: port
                });
            } else {
                return processError(err, reject, resolve, false, host, port);
            }
        });

        socket.on("timeout", () => {
            socket.destroy();
            socket.unref(); // Allow the process to exit
            return resolve({
                success: false,
                message: `TCP port ${port} is closed on ${host}`,
                port: port
            });
        });
        
        socket.connect(port, host);
        socket.setTimeout(timeout);
    });
};

const test_IP = (ip) => {
    const resultObj = {
        'format': 'unknown',
        'address': ip
    }
    if (net.isIPv4(ip)) {
        resultObj.format = 'IPv4';
    }
    else if (net.isIPv6(ip)) {
        resultObj.format = 'IPv6';
    }
    return resultObj;
}

const isIP = (ip) => {
    return net.isIP(ip);
}

module.exports = {
    check_TCP_PORT,
    test_IP,
    isIP
};
