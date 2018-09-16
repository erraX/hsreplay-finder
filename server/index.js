const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crawler = require('./crawler');
const mongo = require('./mongo');
const _ = require('lodash');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.get('/hs/replays', (req, res, next) => {
    let {rankStart, rankEnd, isLegend, won, archetypeName, className, pageNo} = req.query;
    pageNo = parseInt(pageNo);
    rankStart = parseInt(rankStart);
    rankEnd = parseInt(rankEnd);
    const pageSize = 20;
    console.log('/replays query', req.query);
    mongo.getInstance(client => {
        client.db('local').collection('replays').find({}).sort({add_time: -1}).toArray((err, result) => {
            if (err) {
                throw err;
            }

            // Filter won
            if (won === 'true') {
                result = result.filter(r => r.player2_won);
            }

            // Filter rank
            if (isLegend === 'true') {
                result = result.filter(r => r.player2_legend_rank !== 'None');
            }
            else {
                result = result.filter(r => {
                    const p1R = parseInt(r.player1_rank);
                    const p2R = parseInt(r.player2_rank);
                    return p1R >= rankStart && p1R <= rankEnd
                        && p2R >= rankStart && p2R <= rankEnd;
                });
            }

            // Filter className and archeType
            if (className !== 'ALL') {
                result = result.filter(r => r.player2_class_name === className);
            }

            if (archetypeName !== 'ALL') {
                result = result.filter(r => r.player2_archetype_name === archetypeName);
            }
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.json({
                code: 200,
                data: result.slice((pageNo - 1) * pageSize, pageNo * pageSize)
            });
        })
    });
});

app.get('/hs/archetype', (req, res, next) => {
    const {className} = req.query;
    console.log('/archetypes query', req.query);
    mongo.getInstance(client => {
        client.db('local').collection('replays').find({player1_class_name: className}).toArray((err, player1Ret) => {
            if (err) {
                throw err;
            }
            const player1Arch = player1Ret.map(p => p.player1_archetype_name);
            client.db('local').collection('replays').find({player2_class_name: className}).toArray((err, player2Ret) => {
                if (err) {
                    throw err;
                }

                const player2Arch = player2Ret.map(p => p.player2_archetype_name);
                res.json({
                    code: 200,
                    data: _.uniq(player1Arch.concat(player2Arch))
                });
            });
        })
    });
});

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


// start crawler
crawler.start(60 * 1000);

const server = app.listen(8888, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.info('Hsreplay finder listening at http://%s:%s', host, port);
});
