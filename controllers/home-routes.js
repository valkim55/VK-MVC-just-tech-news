//this file will contain all of the user-facing routes - homepage and login pages

const sequelize = require('../config/connection');
const {Post, Comment, User} = require('../models');

//setup main homepage route
const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: { model: User, attributes: ['username'] }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        // pass a single post object in to the homepage template
        //console.log(dbPostData[0])
        const posts = dbPostData.map(post => {
            return post.get({ plain: true });
        })
        res.render('homepage', { posts });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login and signup page
router.get('/login', (req, res) => {
    // check for a session and redirect to the homepage once the user is logged in
    if(req.session.loggedIn) {
        res.redirect('/');
        return
    }
    res.render('login')
})


module.exports = router;