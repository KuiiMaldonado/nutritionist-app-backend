const {User} = require('../models');
const {signToken} = require('../utils/auth');
const {GraphQLError} = require('graphql');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user._id});
            }
        },

        users: async () => {
            return User.find();
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
        }
    }
}

module.exports = resolvers;