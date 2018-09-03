const request = require('request');
const mongo = require('./mongo');

const api = {
    replays: 'https://hsreplay.net/api/v1/live/replay_feed',
    archetypes: 'https://hsreplay.net/api/v1/archetypes'
};

function findInArray(arr, predict) {
    for (let i = 0; i < arr.length; i++) {
        if (predict(arr[i])) {
            return arr[i];
        }
    }
}

function getReplays() {
    return new Promise((resolve, reject) => {
        console.log('start crawl replays');
        request(api.replays, function (error, response, body) {
            let results = [];
            const replays = JSON.parse(body).data;
            request(api.archetypes, function (error, response, body) {
                const arches = JSON.parse(body);
                replays.forEach(({
                    id,
                    player1_archetype,
                    player1_legend_rank,
                    player1_rank,
                    player1_won,
                    player2_archetype,
                    player2_legend_rank,
                    player2_rank,
                    player2_won
                }) => {
                    const play1_arch = findInArray(arches, a => a.id == player1_archetype);
                    const play2_arch = findInArray(arches, a => a.id == player2_archetype);
                    const item = {
                        _id: id,
                        id,
                        add_time: Date.now(),
                        url: 'https://hsreplay.net/replay/' + id,
                        player1_archetype_name: play1_arch.name,
                        player1_legend_rank,
                        player1_rank,
                        player1_won: player1_won === 'True',
                        player1_class_name: play1_arch.player_class_name,
                        player1_arch_url: 'https://hsreplay.net/' + play1_arch.url,
                        player2_archetype_name: play2_arch.name,
                        player2_legend_rank,
                        player2_rank,
                        player2_won: player2_won === 'True',
                        player2_class_name: play1_arch.player_class_name,
                        player2_arch_url: 'https://hsreplay.net/' + play2_arch.url,
                    };

                    results.push(item);
                });

                // Save to mongodb
                mongo.getInstance(client => {
                    client.db('local').collection('replays').insertMany(results, function (e, o) {
                        if (e) {
                            console.log('insert error', e);
                            reject(e);
                            return;
                        }
                        console.log('insert success');
                        resolve(results);
                    });
                });
            });
        });
    });
}

getReplays();

module.exports = {
    start(interval) {
        setInterval(() => {
            getReplays()
                .then(() => {
                    console.log('Fetch replay success');
                })
                .catch(err => {
                    console.log('Fetch replay error', err);
                })
        }, interval);
    }
};
