﻿#!/usr/bin/env node

var debug = require("debug")("OnlineEditorsExampleNodeJS");
var app = require("./app");
var config = require('config');

app.set("port", process.env.PORT || config.get('server.port') || 3000);

console.log('端口：',app.get("port"));
var server = app.listen(app.get("port"), function() {
    debug("Express server listening on port " + server.address().port);
});