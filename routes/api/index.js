const router = require('express').Router();

const userRoutes = require('./user-routes');

//this middleware will serve as an instance for the routes in user-routes so we didn't write /users in there
router.use('/users', userRoutes);

module.exports = router;


