// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule.js');

// Add or update a schedule
router.post('/add', async (req, res) => {
    const { ID, semester, program, section, university, schedule } = req.body;

    try {
        let existingSchedule = await Schedule.findOne({ ID });
        if (existingSchedule) {
            existingSchedule.semester = semester;
            existingSchedule.program = program;
            existingSchedule.section = section;
            existingSchedule.schedule = schedule;
            existingSchedule.university = university;
            await existingSchedule.save();
            return res.json({ message: 'Schedule updated successfully' });
        } else {
            const newSchedule = new Schedule({ ID, semester, program, section, university, schedule });
            await newSchedule.save();
            return res.json({ message: 'Schedule added successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/ids', async (req, res) => {
    try {
        const schedules = await Schedule.find({}, { ID: 1, _id: 0 });
        console.log("");

        const Allids = schedules.map(schedule => schedule.ID);
        res.json({ ids: Allids });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get a schedule by ID
router.get('/schedules/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ ID: req.params.id });
        if (schedule) {
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
