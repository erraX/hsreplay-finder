const mongo = require('./mongo');
mongo.getInstance(client => {
    client.db('local').collection('replays').insertOne({a: 1}, function (e, o) {
        if (e) {
            return console.log('e', e);
        }
        console.log('o' ,o);
    });
    client.close();
});

