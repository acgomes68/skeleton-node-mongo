import mongoose from 'mongoose';

import databaseConfig from '../config/database';

class Database {
    constructor() {
        this.init();
    }

    init() {
        const mongoConfig = databaseConfig.mongo;
        this.mongoConnection = mongoose.connect(
            `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
            {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true,
            }
        );
    }
}

export default new Database();
