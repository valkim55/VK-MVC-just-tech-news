const router = require('express').Router();
const {Comment, User, Post} = require('../../models');
const withAuth = require('../../utils/auth');

// ===== GET all comments =====
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ['id', 'comment_text', 'created_at'],
        include: [ { model: User, attributes: ['username'] }, { model: Post, attributes:['title'] } ]
    }).then(dbCommentData => {
        return res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== POST a new comment =====
router.post('/', withAuth, (req, res) => {
    if(req.session) {   
        Comment.create({
            comment_text: req.body.comment_text,
            // grab user_id from the session
            user_id: req.session.user_id,
            post_id: req.body.post_id
        }).then(dbCommentData => {
            return res.json(dbCommentData);
        }).catch(err => {
            console.log(err);
            req.statusCode(400).json(err);
        })
    }
});

// ===== DELETE a comment =====
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {id: req.params.id}
    }).then(dbCommentData => {
        if(!dbCommentData) {
            return res.status(400).json({message: 'no comments found with this id'});
        }
        res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;