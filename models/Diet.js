const {Schema} = require('mongoose');

const dietSchema = new Schema(
    {
        eTag: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true,
            unique: true
        }
    }
);

module.exports = dietSchema;