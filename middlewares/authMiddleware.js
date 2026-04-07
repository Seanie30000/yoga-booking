
// middlewares/authMiddleware.js
import { UserModel } from '../models/userModel.js';

export const attachUser = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await UserModel.findById(req.session.userId);
            req.user = user;
            res.locals.user = user;
            res.locals.isLoggedIn = true;
            res.locals.isOrganiser = user.role === 'organiser';
        } catch (err) {
            req.user = null;
            res.locals.user = null;
            res.locals.isLoggedIn = false;
            res.locals.isOrganiser = false;
        }
    } else {
        req.user = null;
        res.locals.user = null;
        res.locals.isLoggedIn = false;
        res.locals.isOrganiser = false;
    }
    next();
};

export const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

export const requireOrganiser = (req, res, next) => {
    if (!req.session.userId || !req.user || req.user.role !== 'organiser') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You must be an organiser to access this page.'
        });
    }
    next();
};