const db = require('../config/connection');
const {User} = require('../models');
const userSeeds = require('./userSeeds.json');

db.once('open', async () => {
    try {
        await User.deleteMany({});
        await User.create(userSeeds);
        console.log('All done!');
        process.exit(0);
    } catch (error) {
        throw error;
    }
});