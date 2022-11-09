const {User} = require('../models');
const {signToken} = require('../utils/auth');
const {GraphQLError} = require('graphql');
const {contentDisposition} = require("express/lib/utils");

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
        }
    }
}

module.exports = resolvers;