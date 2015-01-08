var	getCertInfo = require('./getCertInfo'),
	config = require('./config'),
	mongo = require('mongodb');
/*
var db = new mongo.Db(config.mongodb.database, new mongo.Server(config.mongodb.host, config.mongodb.port, {}), {w:1});

db.open(function(err, client){
    client.collection(config.mongodb.collection, function(err, col) {
        getCertInfo('www.paypal.com', function(certChain){
        	col.insert({key: 'www.paypal.com', certs: certChain}, function(){});
        })
    });
});*/
getCertInfo('passport.yandex.ru', function(certChain){
	console.log(certChain[0]);
})