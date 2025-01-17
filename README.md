[![NPM Downloads](https://img.shields.io/npm/dm/netport.svg?style=round-square)](https://npm-stat.com/charts.html?package=netport)
[![NPM Version](http://img.shields.io/npm/v/netport.svg?style=flat)](https://npmjs.com/package/netport)
[![install size](https://packagephobia.com/badge?p=netport)](https://packagephobia.com/result?p=netport)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/netport?style=round-square)](https://bundlephobia.com/package/netport@latest)
[![Gitpod Ready-to-code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=round-square)](https://gitpod.io/#https://github.com/blazeinferno64/netport.js)

# netport

Fast, CPU-friendly, minimalist, light-weight promise-based TCP/UDP port(s) scanner.


## Features

- **Fast and Efficient**: Designed to minimize CPU usage while providing quick results.
- **Promise-Based**: Utilizes JavaScript promises for better asynchronous handling.
- **Supports TCP and UDP**: Check both TCP and UDP ports with ease.
- **Minimalistic Design**: Simple and straightforward API for easy integration.

# Installation

To get started with `netport`, simply run the following command in your terminal:

```bash
$ npm i netport
```

# Getting started

First, require this library to your project as follows:

```js
const netport = require("netport");
```

If it's an ES Module then import it to your project as follows:

```js
import netport from "netport";
```

# Note

New to Promises?

If you're not familiar with promises, check out the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to learn more.

# Api usage

Once you've imported `netport` into your project, you're ready to start working using `netport`!

## scanPort() function

The `scanPort()` function scans a specified port on a specified host and checks whether it is open for the specified protocol (TCP or UDP).

### Parameters

The scanPort() function parameters are as follows -

- `type`: The type of port to scan (`"TCP"` or `"UDP"`). Default is `"TCP"`.
- `port`: The port number to check.
- `host`: The hostname or IP address of the target.
- `timeout`: The timeout duration in milliseconds. Default is `1000 ms`.

### TCP port scan

Example demonstrating TCP port scan:

```javascript
// First example regarding TCP port scan.
(async () => {
    try {
        const result = await netport.scanPort({
            type: "TCP", // Specify the type of port to scan (TCP)
            port: 53,    // DNS port (commonly used for DNS queries)
            host: "8.8.8.8", // Google Public DNS IP address
            timeout: 1000 // Set timeout to 1000 milliseconds
        });

        console.log(result);
        // result object contains -
        // - success: Indicates if the port is open
        // - message: A message providing additional information about the scan
    } catch (err) {
        // Handling the error.
        console.error(err);
    }
})();
```

### UDP port scan

Example demonstrating UDP port scan:

```javascript
// Second example regarding UDP port scan.
(async () => {
    try {
        const result = await netport.scanPort({
            type: "UDP", // Specify the type of port to scan (UDP)
            port: 123,   // NTP port (commonly used for Network Time Protocol)
            host: "pool.ntp.org", // Public NTP server
            timeout: 1000 // Set timeout to 1000 milliseconds
        });

        console.log(result);
        // result object contains -
        // - success: Indicates if the port is open
        // - message: A message providing additional information about the scan
    } catch (err) {
        // Handling the error.
        console.error(err);
    }
})();
```

## `scanPorts()` Function

The `scanPorts()` function scans a range of ports on a specified host and checks whether they are open for the specified protocol (TCP or UDP).

### Parameter

The scanPorts() function parameters are as follows -

- `type`: The type of port to scan (`"TCP"` or `"UDP"`). Default is `"TCP"`.
- `from`: The starting port number.
- `to`: The ending port number.
- `host`: The hostname or IP address of the target.
- `timeout`: The timeout duration in milliseconds. Default is `1000 ms`.
- `maxConcurrency`: The maximum number of concurrent port checks to perform. Default is `100`.

### TCP ports scan

Example demonstrating TCP ports scan:

```js
// First example regarding TCP ports scan.
(async () => {
    try {
        const results = await netport.scanPorts({
            type: "TCP",        // Specify the type of ports to scan (TCP)
            from: 1,           // Starting from port 1
            to: 100,           // Scanning up to port 100
            host: "8.8.8.8",   // Google Public DNS IP address
            timeout: 1000,     // Set timeout to 1000 milliseconds for each port check
            maxConcurrency: 50  // Optional: Set maximum concurrent connections (default is 100)
        });

        // Results returned is an array of objects.
        results.forEach(result => {
            console.log(`Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
            // - result.port: The port number that was scanned
            // - result.success: Indicates if the port is open (true) or closed (false)
            // - result.message: Additional information about the scan result
        });
    } catch (err) {
        // Handling any errors that occur during the scan.
        console.error('Error during port scan:', err);
    }
})();

```

### UDP ports scan

Example demonstrating UDP ports scan:

```js
// Second example regarding UDP ports scan.
(async () => {
    try {
        const results = await netport.scanPorts({
            type: "UDP",            // Specify the type of ports to scan (UDP)
            from: 1,               // Starting from port 1
            to: 100,               // Scanning up to port 100
            host: "pool.ntp.org",  // Public NTP server for time synchronization
            timeout: 1000,         // Set timeout to 1000 milliseconds for each port check
            maxConcurrency: 50      // Optional: Set maximum concurrent connections (default is 100)
        });

        // Results returned is an array of objects.
        results.forEach(result => {
            console.log(`Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
            // - result.port: The port number that was scanned
            // - result.success: Indicates if the port is open (true) or closed (false)
            // - result.message: Additional information about the scan result
        });
    } catch (err) {
        // Handling any errors that occur during the scan.
        console.error('Error during UDP port scan:', err);
    }
})();

```

# LICENSE

`netport` is released under the MIT License.

View the full license terms <a href="https://github.com/BlazeInferno64/netport.js/blob/main/LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [netport issue tracker](https://github.com/blazeinferno64/netport.js/issues).

`Thanks for reading!`

`Have a great day ahead :D`