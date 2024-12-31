// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 31/12/2024

"use strict";

const { processError } = require("./utils/errors");
const { check_TCP_PORT, test_IP, } = require("./utils/TCP");
const { check_UDP_PORT } = require("./utils/UDP");

const packageJson = require("../package.json");
const supportedSchemas = new Set(['data:', 'http:', 'https:']);


/**
 * Scans and checks a host's port.
 * 
 * @param {Object} inputObject - The object containing the scan info.
 * @returns {Promise} - returns whether the port is available or not.
 */
const checkPort = async (inputObject) => {
    const host = inputObject.host;
    const port = inputObject.port;
    const type = inputObject.type || "TCP";
    const timeout = inputObject.timeout;

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
 * Scans and checks the given TCP/UDP ports.
 * 
 * @param {*} inputObject - The object containing the scan info.
 * @returns {Promise<any>} - Returns a promise containing the scan status.
 */
const checkPorts = async (inputObject) => {
    const host = inputObject.host;
    const startingPort = inputObject.from;
    const endingPort = inputObject.to;
    const type = inputObject.type || "TCP";
    const timeout = inputObject.timeout;

    // Validate whether it has supported protocol or not.
    if (!supportedSchemas.has(type)) {
        const customError = 'ERR_TYPE';
        return await processError(customError, false, false, type, host, `ports ${startingPort} - ${endingPort}`);
    }

    const results = [];
    const maxConcurrentChecks = 100; // Limit to 100 concurrent connections
    const portChecks = [];

    for (let port = startingPort; port <= endingPort; port++) {
        portChecks.push(port);
    }

    // Function to process a batch of ports
    const processBatch = async (batch) => {
        const batchResults = await Promise.all(batch.map(async (port) => {
            try {
                const result = type === 'TCP'
                    ? await check_TCP_PORT(host, port, timeout)
                    : await check_UDP_PORT(host, port, timeout);
                return { port, success: result.success, message: result.message };
            } catch (error) {
                return { port, success: false, message: error.message };
            }
        }));
        results.push(...batchResults);
    };

    // Process ports in batches
    for (let i = 0; i < portChecks.length; i += maxConcurrentChecks) {
        const batch = portChecks.slice(i, i + maxConcurrentChecks);
        await processBatch(batch);
    }
    // Lastly return the results
    return results;
}

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
 * @returns {Object} Returns a object which contains some info regarding blazed.js.
 */

const ABOUT = () => {
    if (!packageJson) throw new Error(`package.json files seems to be missing!\nPlease try again by downloading 'netport' again with the following command\n''npm i netport''\nin your terminal!`);
    const aboutObject = {
        "Name": packageJson.name,
        "Author": packageJson.author,
        "Version": packageJson.version,
        "Description": packageJson.description,
        "Respository": packageJson.repository
    };
    return aboutObject;
};
/**
 * 
 * @returns {string} returns the package version
 */

const VERSION = () => {
    if (!packageJson) throw new Error(`package.json files seems to be missing!\nPlease try again by downloading 'netport' again with the following command\n''npm i netport''\nin your terminal!`);
    return packageJson.version;
}

module.exports = {
    scanPort: (inputObject) => checkPort(inputObject),
    scanPorts: (inputObject) => checkPorts(inputObject),
    check_IP,
    ABOUT,
    VERSION
}