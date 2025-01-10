// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 31/12/2024

"use strict";

const dgram = require("dgram");
const { setTimeout, clearTimeout} = require("timers");
const { processError } = require("./errors");

const check_UDP_PORT = (host = '127.0.0.1', port, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        const socket = dgram.createSocket("udp4");

        // console.log(`Checking UDP port ${port} on ${host}...`);

        const timeoutId = setTimeout(async () => {
            // console.log(`Timeout waiting for response from ${host}:${port}`);
            socket.close();
            const customError = `ERR_TIMEOUT`;
            await processError(customError, reject, resolve, false, host, port);
        }, timeout);

        socket.on("message", (msg, rinfo) => {
            // console.log(`Received message from ${rinfo.address}:${rinfo.port}`);
            socket.close();
            clearTimeout(timeoutId);
            return resolve({
                success: true,
                message: `UDP port ${port} is open on ${host}`
            });
        });

        socket.on("error", async (err) => {
            // console.error(`Socket error: ${err.message}`);
            socket.close();
            clearTimeout(timeoutId);
            await processError(err, reject, resolve, false, host, port);
        });

        // Bind the socket to listen for incoming messages
        socket.bind(() => {
            // console.log(`Socket bound. Sending message to ${host}:${port}`);
            const message = Buffer.from("Hello World");
            socket.send(message, 0, message.length, port, host, (err) => {
                if (err) {
                    // console.error(`Error sending message: ${err.message}`);
                    clearTimeout(timeoutId);
                    socket.close();
                    return processError(err, reject, resolve, false, host, port);
                }
                // console.log(`Message sent to ${host}:${port}`);
            });
        });
    });
}

module.exports = {
    check_UDP_PORT
}