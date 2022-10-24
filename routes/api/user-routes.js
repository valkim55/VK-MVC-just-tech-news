const router = require('express').Router();
const {User} = require('../../models');

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
        attributes: {exclide: ['password']},
        where: {
            id: req.params.id // SELECT * FROM users WHERE id=?;
        }
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