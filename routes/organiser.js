
// routes/organiser.js
import { Router } from 'express';
import { requireLogin, requireOrganiser } from '../middlewares/authMiddleware.js';
import {
    organiserCoursesPage,
    addCoursePage,
    addCourse,
    editCoursePage,
    editCourse,
    deleteCourse,
    organiserSessionsPage,
    addSession,
    deleteSession,
    classListPage,
    manageUsersPage,
    deleteUser,
    changeUserRole
} from '../controllers/organiserController.js';

const router = Router();

// Protect all organiser routes
router.use(requireLogin);
router.use(requireOrganiser);

// Course management
router.get('/courses', organiserCoursesPage);
router.get('/courses/add', addCoursePage);
router.post('/courses/add', addCourse);
router.get('/courses/:id/edit', editCoursePage);
router.post('/courses/:id/edit', editCourse);
router.post('/courses/:id/delete', deleteCourse);

// Session management
router.get('/courses/:id/sessions', organiserSessionsPage);
router.post('/courses/:id/sessions/add', addSession);
router.post('/sessions/:sessionId/delete', deleteSession);

// Class list
router.get('/sessions/:sessionId/classlist', classListPage);

// User management
router.get('/users', manageUsersPage);
router.post('/users/:id/delete', deleteUser);
router.post('/users/:id/role', changeUserRole);

export default router;