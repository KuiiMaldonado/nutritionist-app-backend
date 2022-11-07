const router = require('express').Router();

router.post('/sendContactEmail', (req, res) => {
    try {
        res.status(200).json({message: 'Hello world'});
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;