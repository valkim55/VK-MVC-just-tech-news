const router = require('express').Router();
const {User, Post, Vote, Comment} = require('../../models');

// ===== GET all users => /api/users =====
router.get('/', (req, res) => {
    // access the User model and run .findAll() method = SELECT * FROM users
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// ===== GET a single user => /api/users/id =====
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id // SELECT * FROM users WHERE id=?;
        }, 
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: { model: Post, attributes: ['title'] }     // JOIN - includes Comment model that includes Post model so you can see on which post this user commented
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'no user found with this id' });
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== POST a new user => api/users/ =====
router.post('/', (req, res) => {
    // expected {username: 'potato', email: 'potato@gmail.com', password: 'potato123'} same as INSERT INTO users (username, email, password) VALUES ('potato', 'potato@gmail.com', 'potato123')
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// ===== UPDATE a user => /api/users/id =====
router.put('/:id', (req, res) => {
    // expected {username: 'potato', email: 'potato@gmail.com', password: 'potato123'} same as UPDATE users SET username='potato', email = 'potato@gmail.com', password = 'potato123' WHERE id=?;
    // if req.body has exact key/value pairs to match the model, you can just use 'req.body' 
    User.update(req.body, {
        individualHooks: true,
        where: { id: req.params.id }
    }).then(dbUserData => {
        if(!dbUserData[0]) {
            res.status(400).json({ message: 'no user found with this id' });
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// ===== LOGIN ROUT =====
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({message: 'no user found with this email'});
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({message: 'incorrect password!'});
            return;
        }
        res.json({user: dbUserData, message: 'you qre now logged in!'});
    });
});

// ===== DELETE a user=> /api/users/id =====
router.delete('/:id', (req, res) => {
    User.destroy({
        where: { id:req.params.id }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'no user found with this id'});
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;