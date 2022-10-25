const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');

//this middleware will serve as an instance for the routes in user-routes so we didn't write /users in there
router.use('/users', userRoutes);
router.use('/posts', postRoutes);


module.exports = router;


