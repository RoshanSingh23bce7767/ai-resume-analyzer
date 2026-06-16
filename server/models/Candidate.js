import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Unknown Candidate'
    },
    email: {
        type: String,
        default: 'unknown@example.com'
    },
    atsScore: {
        type: Number,
        default: 0
    },
    matchScore: {
        type: Number,
        default: 0
    },
    skills: {
        type: [String],
        default: []
    },
    matchedSkills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
    suggestions: {
        type: [String],
        default: []
    },
    jobDescription: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'Analyzed'
    },
    resumeText: {
        type: String,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Candidate', candidateSchema);
