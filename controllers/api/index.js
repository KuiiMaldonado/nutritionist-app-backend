const router = require('express').Router();
const emailRoutes = require('./email-routes');

router.use('/emailJS', emailRoutes);

module.exports = router;