//this file will contain all of the user-facing routes - homepage and login pages

//setup main homepage route
const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('homepage');
});

module.exports = router;