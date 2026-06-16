import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { geminiApiKey } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ geminiApiKey });
        } else {
            settings.geminiApiKey = geminiApiKey;
            settings.updatedAt = Date.now();
        }
        await settings.save();
        res.json({ message: 'Settings saved successfully', settings });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

export default router;
