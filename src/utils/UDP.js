// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 17/01/2025

"use strict";

const dgram = require("dgram");
const { setTimeout, clearTimeout} = require("timers");
const { processError } = require("./errors");

const check_UDP_PORT = (host = '127.0.0.1', port, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        const socket = dgram.createSocket("udp4");

        const timeoutId = setTimeout(async () => {
            socket.close();
            const customError = `ERR_TIMEOUT`;
            await processError(customError, reject, resolve, false, host, port);
        }, timeout);

        socket.on("message", (msg, rinfo) => {
            socket.close();
            clearTimeout(timeoutId);
            return resolve({
                success: true,
                message: `UDP port ${port} is open on ${host}`
            });
        });

        socket.on("error", async (err) => {
            socket.close();
            clearTimeout(timeoutId);
            await processError(err, reject, resolve, false, host, port);
        });

        // Bind the socket to listen for incoming messages
        socket.bind(() => {
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