[![npm version](https://badge.fury.io/js/reach-socket.svg)](http://badge.fury.io/js/reach-socket)
[![npm](https://img.shields.io/npm/dm/reach-socket.svg?style=flat)](https://www.npmjs.com/package/reach-socket)
[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/reach/reach-socket/blob/master/LICENSE.md)

# Reach Socket

A socket.io server designed to relay socket.io events via socket.io-redis.

This setup was mainly created for a easy to setup, independent socket.io server that can relay events from multiple back end service to any front end socket connected. It also supports socket authentication and private user communication out of the box.

Its designed to work against an authentication api/service.

## [Setup](#setup)

Start by installing the reach-socket package via npm.

```sh
# Install reach-socket into your application.
$ npm install reach-socket
```

Include reach-socket server by adding it to your server:

```js
let socket = require('reach-socket');

// ### Start Server

socket({
  port : 5000,
  auth : 'http://authentication.url/me',
  redis : {
    host : 'localhost',
    port : 6379
  }
});
```

## [Events](#events)

To communicate with the socket.io server you need to use [`socket.io-emitter`](https://www.npmjs.com/package/socket.io-emitter) that connects to the redis instance the server is listening for events.
