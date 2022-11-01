const router = require('express').Router();
const apiRoutes = require('./api/');
const homeRoutes = require('./home-routes.js');

// middleware for home-routes
router.use('/', homeRoutes);

// this middleware will identify the routes for API requests from the front-end
//ALSO this is useful in case the you or client makes a request to the endpoint that doesn't exist, then it'll skip /users in index.js from api folder and hit this endpoint and see an error
router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;


