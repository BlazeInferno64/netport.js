// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 17/01/2025

// Type definitions for 'netport'

interface ResultObject {
    /**
     * Status of the promise.
     */
    success: boolean;
    /**
     * The message returned by the promise.
     */
    message: string;
    /**
     * The port number that was scanned (if applicable).
     */
    port?: number; // Optional, only applicable for scanPorts
}

interface IpResultObject {
    /**
     * The type of ip address.
     */
    format: String;
    /**
     * The ip address.
     */
    address: String;
}

interface InputObject {
    /**
     * The host (e.g., google.com).
     * 
     * If not specified, netport will default to '127.0.0.1' (localhost).
     */
    host?: string;
    /**
     * The port number.
     */
    port?: number;
    /**
     * The timeout duration in milliseconds.
     * 
     * Default timeout value is '1000' ms (milliseconds).
     * Must be a positive integer.
     */
    timeout?: number;
    /**
     * The type of the scan (TCP/UDP).
     * 
     * If not specified, netport will default to 'TCP'.
     */
    type?: "TCP" | "UDP";
}

interface SecondInputObject {
    /**
     * The host (e.g., google.com).
     * 
     * If not specified, netport will default to '127.0.0.1' (localhost).
     */
    host?: string;
    /**
     * The starting port number.
     */
    from: number;
    /**
     * The ending port number.
     */
    to: number;
    /**
     * The timeout duration in milliseconds.
     * 
     * Default timeout value is '1000' ms (milliseconds).
     * Must be a positive integer.
     */
    timeout?: number;
    /**
     * The type of the scan (TCP/UDP).
     * 
     * If not specified, netport will default to 'TCP'.
     */
    type?: "TCP" | "UDP";
    /**
     * The maximum number of concurrent port checks to perform.
     * 
     * If not specified, netport will default to '100' max concurrent connections.
    */
    maxConcurrency?: number
}

interface AboutObject {
    /**
     * Name of the package.
     */
    Name: string;
    /**
     * Name of the author.
     */
    Author: string;
    /**
     * Version of the package.
     */
    Version: string;
    /**
     * Description of the package.
     */
    Description: string;
    /**
     * Repository of the package.
     */
    Respository: string;
}

interface Netport {
    /**
     * Scans the given TCP/UDP port present on a given host.
     * 
     * @param {InputObject} inputObj - The object containing the scan data.
     * @returns {Promise<ResultObject>} Returns a promise containing the status of the scan.
     * @example
     * // Example regarding TCP port scan.
     * netport.scanPort({
     *      type: "TCP",
     *      port: 53, // DNS port
     *      host: "8.8.8.8", // Google Public DNS
     *      timeout: 1000 // Set timeout to 1000 milliseconds
     * })
     * .then(result => {
     *      console.log(result);
     *      // result object contains -
     *      // - success
     *      // - message
     * })
     * .catch(err => {
     *      // Handling the error.
     *      console.error(err);
     * });
     */
    scanPort(inputObj: InputObject): Promise<ResultObject>;

    /**
     * Scans the given TCP/UDP ports present on a given host.
     * 
     * @param {SecondInputObject} inputObj - The object containing the scan data.
     * @returns {Promise<ResultObject[]>} Returns a promise containing an array of results for each scanned port.
     * @example
     * // First example regarding TCP ports scan.
     * netport.scanPorts({
     *      type: "TCP",
     *      from: 1, // Starting from port 1
     *      to: 100, // Till port 100
     *      host: "8.8.8.8", // Google Public DNS
     *      timeout: 1000 // Set timeout to 1000 milliseconds 
     * })
     * .then(results => {
     *      // Results returned is an array.
     *      results.forEach(result => {
     *          console.log(`Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
     *      });
     * })
     * .catch(err => console.error(err));
     * 
     * // Second example regarding UDP ports scan.
     * netport.scanPorts({
     *      type: "UDP",
     *      from: 1, // Starting from port 1
     *      to: 100, // Till port 200
     *      host: "pool.ntp.org", // // Public NTP server
     *      timeout: 1000 // Set timeout to 1000 milliseconds 
     * })
     * .then(results => {
     *      // Results returned is an array.
     *      results.forEach(result => {
     *          console.log(`Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
     *      });
     * })
     * .catch(err => console.error(err));
     * 
     */
    scanPorts(inputObj: SecondInputObject): Promise<ResultObject[]>;

    /**
     * Checks the entered ip address.
     * 
     * @param ip - The ip address to check.
     * @returns {IpResultObject} - Returns the format of the entered ip address eg(IPv4, IPv6).
     * @example 
     * // First example regarding IPv4 address checkup
     * console.log(netport.check_IP('127.0.0.1));
     * // Output: { format: 'IPv4', address: '127.0.0.1' }
     * 
     * // Second example regarding IPv6 address checkup
     * console.log(netport.check_IP('::1'));
     * // Output: { format: 'IPv6', address: '::1' }
     */
    check_IP(ip: String): IpResultObject;

    /**
    * @returns {AboutObject<Object>} Returns a object which contains some info regarding netport.
    * @example 
    * console.log(netport.ABOUT); 
    * // Logging the about object to the console.
   */
    ABOUT: AboutObject;

    /**
    * @returns {String} returns the package version.
    * @example 
    * console.log(netport.VERSION); 
    * // Logging the about object to the console.
   */
    VERSION: String;
}

/**
 * netport is a fast, CPU-friendly, minimalist, light-weight promise-based TCP/UDP port(s) scanner.
 * 
 * Port scanning done right!
 * 
 * Learn more about it from [here](https://github.com/blazeinferno64/netport.js)
 * @example 
 * // Require it in your project by doing -
 * const netport = require("netport");
 * 
 * // Or import it to your project if its an ES module by doing -
 * import netport from "netport";
 */
declare const netport: Netport;
export = netport;