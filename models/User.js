const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const measureSchema = require('./Measure');
const dietSchema = require('./Diet');
const trainingSchema = require('./Training');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/[\w.]+@[a-z]+\.[a-z]+/, 'Must use a valid email address'],
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        profilePictureURL: {
            type: String
        },
        userMeasures: [measureSchema],
        userDiets: [dietSchema],
        userTrainings: [trainingSchema],
    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);

// hash the user's password
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 15;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

userSchema.pre('findOneAndUpdate', async function(next) {
    const saltRounds = 15;
    if (this._update.hasOwnProperty('password')) {
        this._update.password = await bcrypt.hash(this._update.password, saltRounds);
    }
    if (this._update.hasOwnProperty('$set')) {
        if (this._update.$set.hasOwnProperty('password'))
            this._update.$set.password = await bcrypt.hash(this._update.$set.password, saltRounds);
    }
    next();
})

// method to compare and validate user's password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = model('User', userSchema);

module.exports = User;