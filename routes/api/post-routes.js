const router = require('express').Router();
const {Post, User} = require('../../models');


// ===== GET all posts =====
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        // does ORDER BY the data of creation so the newest posts will be at the top
        order: [ ['created_at', 'DESC'] ],
        include: [ { model: User, attributes: ['username'] } ] //JOIN
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
        attribute: ['id', 'post_url', 'title', 'created_at'],
        include: [ { model: User, attributes: ['username'] } ]
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