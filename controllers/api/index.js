const router = require('express').Router();
const emailRoutes = require('./email-routes');
const filesRoutes = require('./files-routes');
const googleRoutes = require('./google-routes');

router.use('/emailJS', emailRoutes);
router.use(filesRoutes);
router.use(googleRoutes);

module.exports = router;