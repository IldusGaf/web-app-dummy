const express = require('express');
const {host, port} = require('../config/serverConfig');
const router = require('../src/routes/index');
const logger = require('./logger');
const context = require('request-context');
const { v4: generateUUID } = require('uuid');

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}))

app.use(context.middleware('request'))

app.use((req, res, next) => {
    context.set('uuid', generateUUID())
    res.type('text/plain')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use('/', router)

app.use((err, req, res, next) => {
    logger.fatal(err)
    res.status(520).send(err.toString())
    next()
})

module.exports = app;