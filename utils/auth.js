const jwt = require('jsonwebtoken');

const secret = 'BAA69@>>C1pBMakP>1e=tC&4%;vd4Y';
const expiration = '2h';

module.exports = {
    authMiddleware: function ({req}) {
        let token = req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, {maxAge: expiration});
            req.user = data;
        } catch {
            console.log('Invalid token');
        }
        return req;
    },
    signToken: function ({username, email, _id, isAdmin}) {
        const payload = {username, email, _id, isAdmin};

        return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    }
}