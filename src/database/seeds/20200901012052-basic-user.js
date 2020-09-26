module.exports = {
    up: QueryInterface => {
        return QueryInterface.bulkInsert(
            'users',
            [
                {
                    name: 'test user',
                    email: 'user@test.com',
                    created_at: new Date(),
                },
            ],
            {}
        );
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
