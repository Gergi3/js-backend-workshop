const express = require('express');
const router = express.Router();

const authServices = require('../services/authServices');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const unauthenticateMiddleware = require('../middlewares/unauthenticateMiddleware')

router.get('/logout', authenticateMiddleware, async (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/');
});

router.use(unauthenticateMiddleware);

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { username, password, repassword } = req.body;

    try {
        const user = await authServices.register(username, password, repassword);

        res.redirect('login');
    } catch (err) {
        res.redirect('register');
    }
});


router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {    
    const { username, password } = req.body;

    try {
        const sessionToken = await authServices.login(username, password);
        res.cookie('session-token', sessionToken);
        res.redirect('/');
    } catch (err) {
        res.redirect('login');
    }
});

exports.authRouter = router;