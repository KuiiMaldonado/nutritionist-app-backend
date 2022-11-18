const router = require('express').Router();
const emailRoutes = require('./email-routes');
const filesRoutes = require('./files-routes');

router.use('/emailJS', emailRoutes);
router.use(filesRoutes);

module.exports = router;