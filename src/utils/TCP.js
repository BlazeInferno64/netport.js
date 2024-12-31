// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 31/12/2024

"use strict";

const net = require("net");
const { processError } = require("./errors");


const check_TCP_PORT = (host = '127.0.0.1', port, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.on("connect", () => {
            socket.end();
            return resolve({
                success: true,
                message: `TCP port ${port} is open on ${host}`
            });
        });

        socket.on("error", async (err) => {
            socket.destroy();
            if (err.code !== 'ECONNREFUSED') {
                return await processError(err, reject, resolve, false, host, port);
            } else if (err.code === 'ENOTFOUND') {
                return await processError(err, reject, resolve, false, host, port);
            } else {
                return resolve({
                    success: false,
                    message: `TCP port ${port} is closed on ${host}`
                });
            };
        });

        socket.on("timeout", () => {
            socket.destroy();
            return reject({
                success: false,
                message: `Timeout occured while connecting to the TCP port ${port}!`
            })
        })
        
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

module.exports = {
    check_TCP_PORT,
    test_IP
}