[![NPM Downloads](https://img.shields.io/npm/dm/netport.svg?style=round-square)](https://npm-stat.com/charts.html?package=netport)
[![NPM Version](http://img.shields.io/npm/v/netport.svg?style=flat)](https://npmjs.com/package/netport)
[![install size](https://packagephobia.com/badge?p=netport)](https://packagephobia.com/result?p=netport)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/netport?style=round-square)](https://bundlephobia.com/package/netport@latest)
[![Gitpod Ready-to-code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=round-square)](https://gitpod.io/#https://github.com/blazeinferno64/netport.js)

# netport

netport is a fast, CPU-friendly, minimalist, light-weight promise-based TCP/UDP port scanner.


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

The scanPort() function parameters are as follows -

- `type`: The type of port to scan (`"TCP"` or `"UDP"`). Default is `"TCP"`.
- `port`: The port number to check.
- `host`: The hostname or IP address of the target.
- `timeout`: The timeout duration in milliseconds. Default is `1000 ms`.

### TCP port scan

Example demonstrating TCP port scan:

```javascript
// First example regarding TCP port scan.
netport.scanPort({
     type: "TCP",
     port: 53, // DNS port
     host: "8.8.8.8", // Google Public DNS
     timeout: 1000 // Set timeout to 1000 milliseconds
})
.then(result => {
     console.log(result);
     // result object contains -
     // - success
     // - message
})
.catch(err => {
     // Handling the error.
     console.error(err);
});
```

### UDP port scan

Example demonstrating UDP port scan:

```javascript
// Second example regarding UDP port scan.
netport.scanPort({
     type: "UDP",
     port: 123, // NTP port
     host: "pool.ntp.org", // Public NTP server
     timeout: 1000 // Set timeout to 1000 milliseconds
})
.then(result => {
     console.log(result);
     // result object contains -
     // - success
     // - message
})
.catch(err => {
     // Handling the error.
     console.error(err);
});
```

## scanPorts() function

The scanPorts() function parameters are as follows -

- `type`: The type of port to scan (`"TCP"` or `"UDP"`). Default is `"TCP"`.
- `from`: The starting port number.
- `to`: The ending port number.
- `host`: The hostname or IP address of the target.
- `timeout`: The timeout duration in milliseconds. Default is `1000 ms`.

### TCP ports scan

```js
// First example regarding TCP port scan.
netport.scanPorts({
     type: "TCP",
     from: 1, // Starting from port 1
     to: 100, // Till port 100
     host: "8.8.8.8", // Google Public DNS
     timeout: 1000 // Set timeout to 1000 milliseconds
})
.then(results => {
     // Results returned is an array.
     results.forEach(result => {
         console.log(`Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
     });
})
.catch(err => console.error(err));

```

### UDP ports scan

```js
// Second example regarding UDP ports scan.
netport.scanPorts({
     type: "UDP",
     from: 1, // Starting from port 1
     to: 100, // Till port 200
     host: "pool.ntp.org", // // Public NTP server
     timeout: 1000 // Set timeout to 1000 milliseconds 
})
.then(results => {
     // Results returned is an array.
     results.forEach(result => {
         console.log(`Port ${result.port}: ${result.success ? 'Open' : 'Closed'} - ${result.message}`);
     });
})
.catch(err => console.error(err));

```

# LICENSE

`netport` is released under the MIT License.

View the full license terms <a href="https://github.com/BlazeInferno64/netport.js/blob/main/LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [netport issue tracker](https://github.com/blazeinferno64/netport.js/issues).

`Thanks for reading!`

`Have a great day ahead :D`