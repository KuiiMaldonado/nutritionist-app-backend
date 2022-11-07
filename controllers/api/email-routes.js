const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

router.post('/sendContactEmail', async (req, res) => {
    try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: 'contact_form_service',
            template_id: 'contact_form_template',
            user_id: process.env.EMAILJS_USER_ID,
            accessToken: process.env.EMAILJS_TOKEN,
            template_params: req.body
        }, {
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.status === 200) {
            res.status(200).json({message: 'Email sent successfully'});
        }
    } catch (error) {
        console.error(error.response.data);
        res.status(error.response.status).json(error.response.data);
    }
});

module.exports = router;