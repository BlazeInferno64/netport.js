// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 28/02/2026

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
    port?: number;
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

interface DnsResult {
    /**
     * Whether the lookup succeeded.
     */
    success: boolean;
    /**
     * The resolved IP address (present if success is true).
     */
    ip?: string;
    /**
     * Address family (4 or 6) when lookup succeeds.
     */
    family?: number;
    /**
     * Error message when lookup fails.
     */
    message?: string;
}

/**
 * Detailed information about a discovered local device.
 */
interface DeviceInfo {
    ip: string;
    status: 'online' | 'offline';
    /** Guessed OS based on TTL and banner analysis. */
    os: string;
    /** Confidence score of the OS detection (0-100). */
    confidence: number;
    /** List of common service names detected (e.g., ["SSH", "HTTP"]). */
    services: string[];
    /** Raw banner strings captured from the services. */
    banners: Record<string, string>;
}

interface LanOptions {
    /**
     * Timeout per ping in milliseconds (defaults to 1000).
     */
    timeout?: number;
    /**
     * Maximum concurrency for network probes (defaults to 50).
     */
    maxConcurrency?: number;
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
     *      // - port
     * })
     * .catch(err => {
     *      // Handling the error.
     *      console.error(err);
     * });
     * 
     * // Example regarding UDP port scan.
     * netport.scanPort({
     *      type: "UDP",
     *      port: 123, // DNS port
     *      host: "pool.ntp.org", // Google Public DNS
     *      timeout: 1000 // Set timeout to 1000 milliseconds
     * })
     * .then(result => {
     *      console.log(result);
     *      // result object contains -
     *      // - success
     *      // - message
     *      // - port
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
     *          console.log(`TCP Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
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
     *          console.log(`UDP Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
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
     * 
     * @param port - The port number to check.
     * @returns {String} - Returns the service name associated with the given port number and type.
     * @example 
     * // First example regarding TCP port service name retrieval.
     * console.log(netport.getServiceName(80));
     * // Output: "HTTP"
     */
    getServiceName(port: number): String;


    /**
     * Resolves the given hostname to its corresponding IP address.
     * @param hostname - The hostname to resolve.
     * @return {Promise<DnsResult>} - Returns a promise that resolves to an object containing the success status, resolved IP address (if successful), address family (if successful), and an error message (if unsuccessful).
     * @example
     * netport.resolveHostname('www.google.com')
     *   .then(result => {
     *     if (result.success) {
     *       console.log(`Resolved IP: ${result.ip}, Family: IPv${result.family}`);
     *     } else {
     *       console.error(`DNS resolution failed: ${result.message}`);
     *     }
     *   })
     *   .catch(err => {
     *     console.error(`Error during DNS resolution: ${err.message}`);
     *   });
     */
    resolveHostname(hostname: string): Promise<DnsResult>;

    /**
     * Scans the local subnet for active devices and attempts to fingerprint them via TTL.
     *
     * @param options - Optional settings (timeout, maxConcurrency).
     * @returns {Promise<DeviceInfo[]>} - Promise resolving to array of device info objects.
     * @example
     * netport.discoverLocalDevices({ timeout: 500, maxConcurrency: 20 })
     *   .then(devices => console.log(devices))
     *   .catch(console.error);
     */
    discoverLocalDevices(options?: LanOptions): Promise<DeviceInfo[]>;

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
 * netport is a fast, CPU-friendly, minimalist, light-weight promise-based network utility scanner for the Node.
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