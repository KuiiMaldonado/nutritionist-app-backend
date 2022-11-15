const router = require('express').Router();
require('dotenv').config();

router.post('/uploadDiet', (req, res) => {
    console.log('Upload diet');
    console.log(req);
    res.status(200).send();
});

router.post('/uploadTraining', (req, res) => {

});

router.post('/uploadProfileImage', (req, res) => {

});

module.exports = router;