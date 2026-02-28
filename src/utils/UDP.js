// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 28/02/2026

"use strict";

const dgram = require("dgram");
const { setTimeout, clearTimeout} = require("timers");
const { processError } = require("./errors");

const check_UDP_PORT = (host = '127.0.0.1', port, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        const socket = dgram.createSocket("udp4");

        const timeoutId = setTimeout(() => {
            socket.close();
            clearTimeout(timeoutId);
            // treat as closed port rather than reject
            return resolve({
                success: false,
                message: `UDP port ${port} is closed on ${host}`,
                port: port
            });
        }, timeout);

        socket.on("message", (msg, rinfo) => {
            socket.close();
            clearTimeout(timeoutId);
            return resolve({
                success: true,
                message: `UDP port ${port} is open on ${host}`,
                port: port
            });
        });

        socket.on("error", (err) => {
            socket.close();
            clearTimeout(timeoutId);
            return processError(err, reject, resolve, false, host, port);
        });

        // Bind the socket to listen for incoming messages
        socket.bind(() => {
            socket.unref(); // allow process to exit if idle
            const message = Buffer.from("Hello World!");
            socket.send(message, 0, message.length, port, host, (err) => {
                if (err) {
                    clearTimeout(timeoutId);
                    socket.close();
                    return processError(err, reject, resolve, false, host, port);
                }
            });
        });
    });
}

module.exports = {
    check_UDP_PORT
}