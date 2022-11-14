const {Schema} = require('mongoose');

const measureSchema = new Schema(
    {
        date: {
            type: String,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        bodyFatPercentage: {
            type: String,
            required: true
        },
        leanBodyWeight: {
            type: String,
            required: true
        },
        bodyFat: {
            type: String,
            required: true
        },
        bodyType: {
            type: String,
            required: true
        }
    },
);

module.exports = measureSchema;