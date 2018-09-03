const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crawler = require('./crawler');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    const err = new Error('Not Found, url:' + req.originalUrl);
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    var logMsg = err.stack || err;
    if (err.status && err.status === 404) {
        console.warn(logMsg);
    } else {
        console.fatal(logMsg);
    }
    next(err);
});

app.get('/replays', (req, res, next) => {
    const {rank, won, archetypeName, className} = req.query;
});

// start crawler
crawler.start(60 * 1000);

const server = app.listen(8888, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.info('Hsreplay finder listening at http://%s:%s', host, port);
});
