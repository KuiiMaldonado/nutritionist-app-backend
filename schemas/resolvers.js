const {User} = require('../models');
const {signToken} = require('../utils/auth');
const {GraphQLError} = require('graphql');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id});
            }
            else
            {
                throw new GraphQLError('Access denied!', {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                });
            }
        },

        user: async (parent, {userId}) => {
            const user = await User.findById(userId);
            return user;
        },

        users: async (parent, args, context) => {
            if (!context.user) {
                throw new GraphQLError('Access denied!', {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                });
            }
            if (!context.user.isAdmin) {
                throw new GraphQLError('Access denied!', {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                });
            }
            return User.find().sort({firstName:'desc'});
        },

        getUserMeasures: async (parent, {userId}) => {
            const measures = await User.findById(userId);
            return measures;
        },

        getUserDiets: async (parent, {userId}) => {
            const diets = await User.findById(userId);
            return diets;
        },

        getUserTrainings: async (parent, {userId}) => {
            const trainings = await User.findById(userId);
            return trainings;
        }
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new GraphQLError('Wrong email or password', {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                });
            }

            const verifiedPassword = await user.isCorrectPassword(password);

            if (!verifiedPassword) {
                throw new GraphQLError('Wrong email or password', {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                });
            }

            const token = signToken(user);
            return {token, user};
        },

        addProfile: async (parent, {userInput}) => {
            try {
                const user = await User.create(userInput);
                return user;
            } catch (error) {
                if (error.name === 'MongoServerError') {
                    if (error.code === 11000) {
                        throw new GraphQLError(`${error.keyValue[Object.keys(error.keyValue)]} already in use`);
                    }
                }
            }
        },

        updateProfile: async (parent, {userInput}, context) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$set: userInput},
                {new: true}
            );
            return updatedUser;
        },

        deleteProfile: async (parent, {userId}) => {
            const updatedUser = await User.findByIdAndDelete(userId);
            return updatedUser;
        },

        addMeasure: async (parent, {userId, measureInput}) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$addToSet: {userMeasures: measureInput}},
                {new: true}
            );
            return updatedUser;
        },

        deleteMeasure: async (parent, {measureId, userId}) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$pull: {userMeasures: {_id: measureId}}},
                {new: true}
            );
            return updatedUser;
        },

        addDiet: async (parent, {userId, eTag, fileName}) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$addToSet: {userDiets: {eTag, fileName}}},
                {new: true}
            );
            return updatedUser;
        },

        deleteDiet: async (parent, {userId, dietId}) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$pull: {userDiets: {_id: dietId}}},
                {new: true}
            );
            return updatedUser
        },

        addTraining: async (parent, {userId, eTag, fileName}) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$addToSet: {userTrainings: {eTag, fileName}}},
                {new: true}
            );
            return updatedUser;
        },

        deleteTraining: async (parent, {userId, trainingId}) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId},
                {$pull: {userTrainings: {_id: trainingId}}},
                {new: true}
            );
            return updatedUser;
        },

        updateProfilePicture: async (parent, {url}, context) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$set: {profilePictureURL: url}},
                {new: true}
            );
            return updatedUser;
        }
    }
}

module.exports = resolvers;