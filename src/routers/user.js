const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken(user);
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken(user);
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user);

})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ érror: 'Invalid Updates' });
    }
    const _id = req.user._id;

    try {
        // const user = await User.findById(_id);

        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })

        await req.user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        // if (!user) {
        //     return res.status(404).send();
        // }
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id;

    try {
        // const user = await User.findByIdAndDelete(_id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a word document'));
        }
        // cb(new Error('file must be a PDF'));
        cb(undefined, true);
        // cb(undefined, false);
    }
})
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send();
})

module.exports = router;