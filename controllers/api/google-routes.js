const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

router.post('/validateCaptcha', async (req, res) => {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: req.body.captchaToken
        });
        console.log(response);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

module.exports = router;