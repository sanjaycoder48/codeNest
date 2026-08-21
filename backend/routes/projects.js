const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

const REGEX_META = '.*+?^${}()|[]\\';

// Accepts an array, or a comma-separated string from a simple form field.
const normaliseTechStack = (input) => {
    const list = Array.isArray(input)
        ? input
        : typeof input === 'string' ? input.split(',') : [];

    return [...new Set(
        list.filter(t => typeof t === 'string')
            .map(t => t.trim())
            .filter(Boolean)
    )].slice(0, 20);
};

const validateBody = ({ title, description }) => {
    if (typeof title !== 'string' || !title.trim()) return 'Title is required.';
    if (typeof description !== 'string' || !description.trim()) return 'Description is required.';
    if (title.length > 120) return 'Title must be 120 characters or fewer.';
    if (description.length > 2000) return 'Description must be 2000 characters or fewer.';
    return null;
};

// PATCH is a partial update: validate only the fields that were sent, and build
// an update containing only those. Validating the whole body would make PATCH
// behave like PUT, and unconditionally writing techStack would erase it
// whenever a caller omitted the field.
const buildPatch = (body) => {
    const update = {};

    if ('title' in body) {
        if (typeof body.title !== 'string' || !body.title.trim()) return { error: 'Title is required.' };
        if (body.title.length > 120) return { error: 'Title must be 120 characters or fewer.' };
        update.title = body.title;
    }
    if ('description' in body) {
        if (typeof body.description !== 'string' || !body.description.trim()) return { error: 'Description is required.' };
        if (body.description.length > 2000) return { error: 'Description must be 2000 characters or fewer.' };
        update.description = body.description;
    }
    if ('techStack' in body) {
        update.techStack = normaliseTechStack(body.techStack);
    }

    if (Object.keys(update).length === 0) return { error: 'Nothing to update.' };
    return { update };
};

const validId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Project not found' });
    }
    next();
};

// Create
router.post('/', auth, async (req, res, next) => {
    const invalid = validateBody(req.body);
    if (invalid) return res.status(400).json({ message: invalid });

    try {
        const project = await Project.create({
            title: req.body.title,
            description: req.body.description,
            techStack: normaliseTechStack(req.body.techStack),
            userId: req.user.id
        });
        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
});

// List the signed-in user's projects, newest first, with optional text filter.
router.get('/', auth, async (req, res, next) => {
    // Clamp low as well as high: a negative limit reaches MongoDB as a
    // single-batch cursor hint rather than being rejected.
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    try {
        const filter = { userId: req.user.id };

        if (typeof req.query.q === 'string' && req.query.q.trim()) {
            // Escape regex metacharacters so a search for "c++" is not a syntax error.
            const term = [...req.query.q.trim()]
                .map(ch => (REGEX_META.includes(ch) ? '\\' + ch : ch))
                .join('');
            const rx = new RegExp(term, 'i');
            filter.$or = [{ title: rx }, { description: rx }, { techStack: rx }];
        }

        const [projects, total] = await Promise.all([
            Project.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Project.countDocuments(filter)
        ]);

        res.json({ projects, total, page, limit });
    } catch (err) {
        next(err);
    }
});

// Read one
router.get('/:id', auth, validId, async (req, res, next) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        next(err);
    }
});

// Update
router.patch('/:id', auth, validId, async (req, res, next) => {
    const { error, update } = buildPatch(req.body ?? {});
    if (error) return res.status(400).json({ message: error });

    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            update,
            { returnDocument: 'after', runValidators: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        next(err);
    }
});

// Delete — the ownership check lives in the query, so there is no read-then-write gap.
router.delete('/:id', auth, validId, async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project removed', id: project._id });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
