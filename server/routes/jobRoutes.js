import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

router.get('/recommended', async (req, res) => {
    try {
        const skillsQuery = req.query.skills;
        const candidateSkills = skillsQuery
            ? skillsQuery.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
            : [];

        const jobs = await Job.find();
        
        const recommendations = jobs.map(job => {
            const requiredSkills = job.skills
                ? job.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
                : [];
            
            let matchedCount = 0;
            const matchedSkills = [];
            const missingSkills = [];

            requiredSkills.forEach(reqSkill => {
                if (candidateSkills.includes(reqSkill)) {
                    matchedCount++;
                    matchedSkills.push(reqSkill);
                } else {
                    missingSkills.push(reqSkill);
                }
            });

            const matchScore = requiredSkills.length > 0 
                ? Math.round((matchedCount / requiredSkills.length) * 100) 
                : 0;
            
            // Format nice string cases for output
            return {
                _id: job._id,
                title: job.title,
                company: job.company,
                location: job.location,
                applyUrl: job.applyUrl,
                description: job.description,
                matchScore,
                matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)), 
                missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1))  
            };
        });

        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        res.json({ jobs: recommendations });
    } catch (error) {
        console.error('Error fetching job recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch job recommendations' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, company, skills, description, location, applyUrl } = req.body;
        const newJob = new Job({ title, company, skills, description, location, applyUrl });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

export default router;
