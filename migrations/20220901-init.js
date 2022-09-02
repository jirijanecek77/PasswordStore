module.exports = {
    async up(db) {
        await db.createCollection('passwords');
        await db.collection('passwords').createIndex({userId: 1});
        await db.collection('passwords').createIndex({server: 1});
        await db.collection('passwords').createIndex({login: 1});
    },

    async down(db, client) {
    }
};
