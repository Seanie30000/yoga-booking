
// controllers/organiserController.js
import { CourseModel } from '../models/courseModel.js';
import { SessionModel } from '../models/sessionModel.js';
import { UserModel } from '../models/userModel.js';
import { BookingModel } from '../models/bookingModel.js';

// Show all courses for organiser to manage
export const organiserCoursesPage = async (req, res, next) => {
    try {
        const courses = await CourseModel.list();
        res.render('organiser/courses', {
            title: 'Manage Courses',
            courses: courses.map(c => ({
                id: c._id,
                title: c.title,
                level: c.level,
                type: c.type,
            }))
        });
    } catch (err) {
        next(err);
    }
};

// Show add course form
export const addCoursePage = (req, res) => {
    res.render('organiser/course_form', {
        title: 'Add Course',
        action: '/organiser/courses/add',
        course: {}
    });
};

// Handle add course form submission
export const addCourse = async (req, res, next) => {
    try {
        const { title, level, type, allowDropIn, startDate, endDate, description, location, price } = req.body;
        const course = await CourseModel.create({
            title,
            level,
            type,
            allowDropIn: allowDropIn === 'on',
            startDate,
            endDate,
            description,
            location,
            price: parseFloat(price) || 0,
            sessionIds: []
        });
        res.redirect(`/organiser/courses/${course._id}/sessions`);
    } catch (err) {
        next(err);
    }
};

// Show edit course form
export const editCoursePage = async (req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).render('error', { title: 'Not found', message: 'Course not found' });
        res.render('organiser/course_form', {
            title: 'Edit Course',
            action: `/organiser/courses/${course._id}/edit`,
            course: {
                id: course._id,
                title: course.title,
                level: course.level,
                type: course.type,
                allowDropIn: course.allowDropIn,
                startDate: course.startDate,
                endDate: course.endDate,
                description: course.description,
                location: course.location,
                price: course.price
            }
        });
    } catch (err) {
        next(err);
    }
};

// Handle edit course form submission
export const editCourse = async (req, res, next) => {
    try {
        const { title, level, type, allowDropIn, startDate, endDate, description, location, price } = req.body;
        await CourseModel.update(req.params.id, {
            title,
            level,
            type,
            allowDropIn: allowDropIn === 'on',
            startDate,
            endDate,
            description,
            location,
            price: parseFloat(price) || 0
        });
        res.redirect('/organiser/courses');
    } catch (err) {
        next(err);
    }
};

// Handle delete course
export const deleteCourse = async (req, res, next) => {
    try {
        await SessionModel.deleteByCourse(req.params.id);
        await CourseModel.delete(req.params.id);
        res.redirect('/organiser/courses');
    } catch (err) {
        next(err);
    }
};

// Show sessions for a course
export const organiserSessionsPage = async (req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).render('error', { title: 'Not found', message: 'Course not found' });
        const sessions = await SessionModel.listByCourse(req.params.id);
        res.render('organiser/sessions', {
            title: `Sessions for ${course.title}`,
            course: { id: course._id, title: course.title },
            sessions: sessions.map(s => ({
                id: s._id,
                start: new Date(s.startDateTime).toLocaleString('en-GB'),
                end: new Date(s.endDateTime).toLocaleString('en-GB'),
                capacity: s.capacity,
                booked: s.bookedCount ?? 0
            }))
        });
    } catch (err) {
        next(err);
    }
};

// Handle add session
export const addSession = async (req, res, next) => {
    try {
        const { startDateTime, endDateTime, capacity } = req.body;
        await SessionModel.create({
            courseId: req.params.id,
            startDateTime: new Date(startDateTime).toISOString(),
            endDateTime: new Date(endDateTime).toISOString(),
            capacity: parseInt(capacity) || 20,
            bookedCount: 0
        });
        res.redirect(`/organiser/courses/${req.params.id}/sessions`);
    } catch (err) {
        next(err);
    }
};

// Handle delete session
export const deleteSession = async (req, res, next) => {
    try {
        const session = await SessionModel.findById(req.params.sessionId);
        await SessionModel.delete(req.params.sessionId);
        res.redirect(`/organiser/courses/${session.courseId}/sessions`);
    } catch (err) {
        next(err);
    }
};

// Show class list for a session
export const classListPage = async (req, res, next) => {
    try {
        const session = await SessionModel.findById(req.params.sessionId);
        if (!session) return res.status(404).render('error', { title: 'Not found', message: 'Session not found' });
        const course = await CourseModel.findById(session.courseId);
        const bookings = await BookingModel.findBySession(req.params.sessionId);
        const participants = await Promise.all(
            bookings.map(async b => {
                const user = await UserModel.findById(b.userId);
                return { name: user ? user.name : 'Unknown', email: user ? user.email : '' };
            })
        );
        res.render('organiser/class_list', {
            title: 'Class List',
            course: { title: course ? course.title : 'Unknown' },
            session: {
                start: new Date(session.startDateTime).toLocaleString('en-GB'),
                end: new Date(session.endDateTime).toLocaleString('en-GB')
            },
            participants
        });
    } catch (err) {
        next(err);
    }
};

// Show manage users page
export const manageUsersPage = async (req, res, next) => {
    try {
        const users = await UserModel.findAll();
        res.render('organiser/users', {
            title: 'Manage Users',
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role
            }))
        });
    } catch (err) {
        next(err);
    }
};

// Handle delete user
export const deleteUser = async (req, res, next) => {
    try {
        await UserModel.deleteById(req.params.id);
        res.redirect('/organiser/users');
    } catch (err) {
        next(err);
    }
};

// Handle change user role
export const changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        await UserModel.update(req.params.id, { role });
        res.redirect('/organiser/users');
    } catch (err) {
        next(err);
    }
};