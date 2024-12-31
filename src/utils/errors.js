// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 31/12/2024

"use strict";

/**
 * Util tool for processing errors.
 * 
 * @param {Object} error - The error you want to process.
 * @param {*} reject - Rejection parameter of promise.
 * @param {*} resolve - Resolve parameter of promise.
 * @param {*} custom - For any customization.
 * @returns {Promise<Object>} returns the processed error object as a promise.
 */
const processError = (error, reject, resolve, custom, host, port) => {
    if (error.code === 'ENOTFOUND') {
        const err = new Error(`DNS Resolution Error`);
        err.code = error.code;
        err.name = "DNS_Resolution_Error";
        err.host = host;
        err.syscall = error.syscall;
        err.message = `Failed to resolve the DNS of '${host}'`;
        return reject(err); // Rejecting the promise with an error
    } else if (error.code === 'EACCES') {
        return resolve({
            success: false,
            message: `Permission denied to access UDP port ${port} on ${host}`
        }); // Resolving with a success message
    } else if (error.code === 'ENETUNREACH') {
        const err = new Error("Network Unreachable");
        err.name = "Network_Unreachable_Error";
        err.code = error.code;
        err.syscall = error.syscall;
        err.address = error.address;
        err.port = error.port;
        err.message = `The network is unreachable by the system!`;
        return reject(err); // Rejecting the promise with an error
    } else if (error === 'ERR_TYPE' && custom) {
        const err = new Error(`Unsupported Protocol`);
        err.code = error;
        err.name = `Unsupported_Protocol_Error`;
        err.message = `Protocol ${custom} not supported!`;
        return err; // Returning the promise with an error
    } else if (error === 'ERR_TIMEOUT') {
        const err = new Error(`Timeout`);
        err.code = error;
        err.name = `Timeout_Error`;
        err.message = `Timeout waiting for response from ${host}:${port}`;
        return reject(err); // Rejecting the promise with an error
    } else if (reject) {
        return reject(error); // Rejecting the promise with the original error
    } else {
        return Promise.resolve(error); // Resolving with the error object if no rejection is needed
    }
}

module.exports = {
    processError
}