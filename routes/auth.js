
// routes/auth.js
import { Router } from 'express';
import { UserModel } from '../models/userModel.js';

const router = Router();

// Show register page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle register form
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await UserModel.findByEmail(email);
        if (existing) {
            return res.render('register', {
                title: 'Register',
                error: 'An account with that email already exists'
            });
        }
        const user = await UserModel.create({ name, email, password, role: 'student' });
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('register', {
            title: 'Register',
            error: 'Something went wrong, please try again'
        });
    }
});

// Show login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Handle login form
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }
        const valid = await UserModel.validatePassword(password, user.password);
        if (!valid) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('login', {
            title: 'Login',
            error: 'Something went wrong, please try again'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;