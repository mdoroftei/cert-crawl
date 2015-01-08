var config = {}

config.rabbitmq = {};
config.mongodb = {};
//config.rabbitmq.host = 'rabbitmq-ot-02.plant.nimbus';
config.rabbitmq.host = '10.0.2.6';
config.rabbitmq.port = 5672;
config.rabbitmq.queue = 'ot-cert-top_alexa';
config.mongodb.host = '10.0.2.4';
config.mongodb.database = 'certificates';
config.mongodb.port = 27017;
config.mongodb.collection = 'crawl';

module.exports = config;
