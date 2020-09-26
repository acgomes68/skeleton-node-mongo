import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];

class Database {
    constructor() {
        this.init();
    }

    init() {
        const postgresConfig = databaseConfig.postgres;
        this.connection = new Sequelize(postgresConfig);
        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
