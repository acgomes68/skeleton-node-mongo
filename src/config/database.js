require('dotenv').config({
    path: process.env.NODE_ENV === 'testing' ? '.env.testing' : '.env',
});

const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

module.exports = {
    mongo: {
        host: MONGO_HOST,
        port: MONGO_PORT,
        database: MONGO_DATABASE,
    },
};
