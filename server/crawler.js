const request = require('request');

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
    return new Promise((resolve) => {
        let results = [];
        request(api.replays, function (error, response, body) {
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
                    console.log(item);
                    results.push(item);
                });
            });
        });
    });
}

module.exports = function start(interval) {
    setInterval(() => getReplays(), interval);
}
