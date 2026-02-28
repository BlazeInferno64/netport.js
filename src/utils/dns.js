// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 28/02/2026

"use strict";

const dns = require("dns/promises");
const { processError } = require("./errors");


/**
 * Resolves a hostname to an IP address.
 */
const resolveHostname = async (hostname) => {
    try {
        const result = await dns.lookup(hostname);
        return { success: true, ip: result.address, family: result.family };
    } catch (err) {
        return { success: false, message: err.message };
    }
};


module.exports = {
    resolveHostname
}