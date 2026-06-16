import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    geminiApiKey: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Settings', settingsSchema);
