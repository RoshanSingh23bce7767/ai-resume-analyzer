import express from 'express';
import Candidate from '../models/Candidate.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();

        // 1. Monthly Uploads (simple logic based on uploadedAt)
        const monthlyCounts = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize months
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            monthlyCounts[months[d.getMonth()]] = 0;
        }

        const scoreDistributionMap = {
            '90-100': 0,
            '80-89': 0,
            '70-79': 0,
            '60-69': 0,
            '<60': 0
        };

        const skillsCount = {};

        candidates.forEach(candidate => {
            // Monthly
            if (candidate.uploadedAt) {
                const monthStr = months[candidate.uploadedAt.getMonth()];
                if (monthlyCounts[monthStr] !== undefined) {
                    monthlyCounts[monthStr]++;
                }
            }

            // Score Distribution
            const score = candidate.matchScore || candidate.atsScore || 0;
            if (score >= 90) scoreDistributionMap['90-100']++;
            else if (score >= 80) scoreDistributionMap['80-89']++;
            else if (score >= 70) scoreDistributionMap['70-79']++;
            else if (score >= 60) scoreDistributionMap['60-69']++;
            else scoreDistributionMap['<60']++;

            // Top Skills
            const skills = candidate.matchedSkills?.length > 0 ? candidate.matchedSkills : candidate.skills;
            if (skills && Array.isArray(skills)) {
                skills.forEach(skill => {
                    skillsCount[skill] = (skillsCount[skill] || 0) + 1;
                });
            }
        });

        // Format for recharts
        const monthlyUploads = Object.keys(monthlyCounts).reverse().map(name => ({
            name,
            resumes: monthlyCounts[name]
        }));

        const scoreDistribution = Object.keys(scoreDistributionMap).map(range => ({
            range,
            count: scoreDistributionMap[range]
        }));

        const topSkillsEntries = Object.entries(skillsCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        res.json({
            monthlyUploads: monthlyUploads.length ? monthlyUploads : [
                { name: 'Jan', resumes: 0 }, { name: 'Feb', resumes: 0 } // Fallback
            ],
            scoreDistribution,
            topSkills: topSkillsEntries
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;
