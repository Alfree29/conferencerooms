const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

// GET all rooms
router.get('/', (req, res) => {
    try {
        const rooms = Room.findAll();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET room by ID
router.get('/:id', (req, res) => {
    try {
        const room = Room.findById(req.params.id);
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new room
router.post('/', (req, res) => {
    try {
        const newRoom = Room.create(req.body);
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update room
router.put('/:id', (req, res) => {
    try {
        const updatedRoom = Room.update(req.params.id, req.body);
        if (updatedRoom) {
            res.json(updatedRoom);
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE room
router.delete('/:id', (req, res) => {
    try {
        const deletedRoom = Room.delete(req.params.id);
        if (deletedRoom) {
            res.json({ message: 'Room deleted successfully' });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;