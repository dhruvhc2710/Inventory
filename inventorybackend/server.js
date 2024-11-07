"use strict";
const express_1 = require('express');
var app = express_1();
var port = 3000;



app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
