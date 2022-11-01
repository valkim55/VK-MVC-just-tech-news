//this file will contain all of the user-facing routes - homepage and login pages

const sequelize = require('../config/connection');
const {Post, Comment, User} = require('../models');

//setup main homepage route
const router = require('express').Router();

// ===== GET all posts =====
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
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== login and signup page =====
router.get('/login', (req, res) => {
    // check for a session and redirect to the homepage once the user is logged in
    if(req.session.loggedIn) {
        res.redirect('/');
        return
    }
    res.render('login')
})

// ===== GET a single post and render to the single-post.handlebars =====
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username'] 
            }
        ]
    }).then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'no post found with requested id'});
            return;
        }
        // serialize the data
        const post = dbPostData.get({plain: true});
        res.render('single-post', { post, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});




module.exports = router;