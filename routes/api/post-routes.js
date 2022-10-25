const router = require('express').Router();
const { json } = require('sequelize');
const {Post, User, Vote, Comment} = require('../../models');

// importing database connection to get special functionality for PUT vote request
const sequelize = require('../../config/connection');


// ===== GET all posts =====
router.get('/', (req, res) => {
    Post.findAll({
        // does ORDER BY the data of creation so the newest posts will be at the top
        order: [ ['created_at', 'DESC'] ],
        attributes: ['id', 'post_url', 'title', 'created_at',
                        // add a SQL query to include the total vote count for a post AS vote_count
                        [ sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count' ]
                    ],
        include: [ 
            // JOIN - will include the Comment model that includes User model to attach the username to the comment
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: { model: User, attributes: ['username'] }
            },     
            { model: User, attributes: ['username'] } ] //JOIN - includes User model to attach the username to the post itself
    }).then(dbPostData => {
        return res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== GET a single post =====
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',
                        // add a SQL query to include the total vote count for a post AS vote_count
                        [ sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count' ]
                    ],
        include: [ 
            // JOIN - will include the Comment model that includes User model to attach the username to the comment
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: { model: User, attributes: ['username'] }
            },  
            { model: User, attributes: ['username'] } ]
    }).then(dbPostData => {
        if(!dbPostData) {
            res.status(400).json({message: 'no posts found with this id'});
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== POST a new post =====
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id 
    }).then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


// ===== another PUT route for adding a vote! =====
// HAS TO BE DEFINED BEFORE /:id SO EXPRESS DOESN'T THINK THAT THIS IS A PART OF /:id ROUTE!
// to simplify the code here we created a model method in Post class
router.put('/upvote', (req, res) => {
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => {
            return res.json(updatedPostData)
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



// ===== UPDATE a post's title =====
router.put('/:id', (req, res) => {
    // because you're updating an already existing entry, you need to first retrieve the post instance by id and then alter the value of the title
    Post.update({
        title: req.body.title
    },
    {
        where: {
            id: req.params.id 
        }
    }).then(dbPostData => {
        if(!dbPostData) {
            res.status(400).json({message: 'no post found with this id'});
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== DELETE an instance of a post ======
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {id: req.params.id}
    }).then(dbPostData => {
        if(!dbPostData) {
            res.status(400).json({message: 'no post found with this id'});
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;