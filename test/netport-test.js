// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 31/12/2024

// Note:- This is just a simple test file for 'netport'
//        You can run this file by doing 'npm test' in your terminal

// Requiring the necessary libraries
const netport = require("../index");
const { describe, test, expect } = require("@jest/globals");

describe('Tests for netport', () => {
    test('Test for open TCP port in 127.0.0.1', async () => {
        const result = await netport.scanPort({
            port: 5500,
            type: "TCP",
            timeout: 1000,
        });
        return expect(result).toBeTruthy();
    });

    test('Test for open UDP port in 127.0.0.1', async () => {
        const result = await netport.scanPort({
            port: 5500,
            type: "UDP",
            timeout: 1000,
        });
        return expect(result).toBeTruthy();
    });
    
    test('Test for open TCP ports in 127.0.0.1', async () => {
        const result = await netport.scanPort({
            from: 1,
            to: 100,
            type: "TCP",
            timeout: 1000,
        });
        return expect(result).toBeTruthy();
    });

    test('Test for open UDP ports in 127.0.0.1', async () => {
        const result = await netport.scanPort({
            from: 1,
            to: 100,
            type: "UDP",
            timeout: 1000,
        });
        return expect(result).toBeTruthy();
    });

    test('Check IPv4 address', async () => {
        const result = netport.check_IP('127.0.0.1');
        return expect(result).toBeTruthy();
    });

    test('Check IPv6 address', async () => {
        const result = netport.check_IP('::1');
        return expect(result).toBeTruthy();
    });
})