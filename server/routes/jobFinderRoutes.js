import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Settings from '../models/Settings.js';
import Candidate from '../models/Candidate.js';

dotenv.config();

const router = express.Router();

// Helper: Build search URLs for real job platforms
const buildPlatformLinks = (skills) => {
    const query = encodeURIComponent(skills.join(' '));
    const skillsSlug = skills.slice(0, 3).map(s => s.toLowerCase().replace(/[^a-z0-9]/g, '-')).join('-');
    return [
        { name: 'LinkedIn', url: `https://www.linkedin.com/jobs/search/?keywords=${query}` },
        { name: 'Wellfound', url: `https://wellfound.com/jobs?q=${query}` },
        { name: 'Internshala', url: `https://internshala.com/internships/keywords-${skills.slice(0, 3).join(',')}` },
        { name: 'Indeed', url: `https://www.indeed.com/jobs?q=${query}` },
        { name: 'Naukri', url: `https://www.naukri.com/${skillsSlug}-jobs` },
        { name: 'Glassdoor', url: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${query}` },
    ];
};

// Fallback jobs when no API key is present
const generateFallbackJobs = (skills) => {
    const lowerSkills = skills.map(s => s.toLowerCase());
    const templates = [
        { title: 'Frontend Developer Intern', company: 'TechStartup (Wellfound)', location: 'Remote', platform: 'Wellfound', requiredSkills: ['react', 'javascript', 'css', 'html', 'tailwind'], type: 'Internship', applyUrl: 'https://wellfound.com/jobs' },
        { title: 'Full Stack Developer', company: 'InnovateTech (LinkedIn)', location: 'Bangalore, India', platform: 'LinkedIn', requiredSkills: ['react', 'node.js', 'mongodb', 'express', 'javascript'], type: 'Full-time', applyUrl: 'https://linkedin.com/jobs' },
        { title: 'Backend Developer Intern', company: 'DataFlow Inc (Internshala)', location: 'Remote', platform: 'Internshala', requiredSkills: ['node.js', 'python', 'sql', 'mongodb', 'rest api'], type: 'Internship', applyUrl: 'https://internshala.com/internships' },
        { title: 'React Developer', company: 'PixelCraft Studios (Naukri)', location: 'Hyderabad, India', platform: 'Naukri', requiredSkills: ['react', 'redux', 'javascript', 'typescript', 'css'], type: 'Full-time', applyUrl: 'https://naukri.com' },
        { title: 'Software Engineer Intern', company: 'CloudNine Solutions (Indeed)', location: 'Mumbai, India', platform: 'Indeed', requiredSkills: ['java', 'python', 'sql', 'data structures', 'algorithms'], type: 'Internship', applyUrl: 'https://indeed.com/jobs' },
        { title: 'MERN Stack Developer', company: 'WebWave Technologies (LinkedIn)', location: 'Remote', platform: 'LinkedIn', requiredSkills: ['mongodb', 'express', 'react', 'node.js', 'git'], type: 'Full-time', applyUrl: 'https://linkedin.com/jobs' },
        { title: 'UI/UX Developer', company: 'DesignHub (Glassdoor)', location: 'Delhi, India', platform: 'Glassdoor', requiredSkills: ['figma', 'css', 'javascript', 'react', 'tailwind'], type: 'Full-time', applyUrl: 'https://glassdoor.co.in' },
        { title: 'Data Science Intern', company: 'AnalyticsPro (Internshala)', location: 'Remote', platform: 'Internshala', requiredSkills: ['python', 'machine learning', 'pandas', 'sql', 'data analysis'], type: 'Internship', applyUrl: 'https://internshala.com/internships' },
        { title: 'DevOps Engineer', company: 'ScaleUp Corp (Wellfound)', location: 'Pune, India', platform: 'Wellfound', requiredSkills: ['docker', 'kubernetes', 'aws', 'linux', 'ci/cd'], type: 'Full-time', applyUrl: 'https://wellfound.com/jobs' },
        { title: 'Mobile App Developer', company: 'AppForge (LinkedIn)', location: 'Bangalore, India', platform: 'LinkedIn', requiredSkills: ['react native', 'javascript', 'typescript', 'firebase', 'rest api'], type: 'Full-time', applyUrl: 'https://linkedin.com/jobs' },
    ];

    return templates.map(job => {
        // Use substring matching instead of exact array string match
        const matched = job.requiredSkills.filter(reqSkill => 
            lowerSkills.some(candSkill => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))
        );
        const missing = job.requiredSkills.filter(reqSkill => !matched.includes(reqSkill));
        const matchScore = job.requiredSkills.length > 0 ? Math.round((matched.length / job.requiredSkills.length) * 100) : 0;
        return {
            title: job.title,
            company: job.company,
            location: job.location,
            platform: job.platform,
            type: job.type,
            matchScore,
            matchedSkills: matched.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            missingSkills: missing.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            applyUrl: job.applyUrl,
        };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
};

// GET /api/job-finder — returns AI-powered job recommendations from real platforms
router.get('/', async (req, res) => {
    try {
        // 1. Get candidate skills (from query or from latest candidate)
        let skills = [];
        if (req.query.skills) {
            skills = req.query.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            const latestCandidate = await Candidate.findOne().sort({ uploadedAt: -1 });
            if (latestCandidate && latestCandidate.skills && latestCandidate.skills.length > 0) {
                skills = latestCandidate.skills;
            }
        }

        if (skills.length === 0) {
            return res.json({ jobs: [], platformLinks: [], message: 'No skills found. Please analyze a resume first.' });
        }

        // 2. Build platform links
        const platformLinks = buildPlatformLinks(skills);

        // 3. Try AI-powered job generation
        let apiKey = process.env.GEMINI_API_KEY;
        try {
            const settings = await Settings.findOne();
            if (settings && settings.geminiApiKey) apiKey = settings.geminiApiKey;
        } catch (e) { /* ignore */ }

        if (!apiKey) {
            // Fallback to template-based jobs
            const jobs = generateFallbackJobs(skills);
            return res.json({ jobs, platformLinks, source: 'template' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a job search assistant. Based on the following candidate skills: [${skills.join(', ')}]

Generate exactly 8 realistic job/internship listings that this candidate would find on platforms like Wellfound, LinkedIn, Internshala, Indeed, Naukri, or Glassdoor.

For each job, return:
- title: Job title (e.g. "Frontend Developer Intern")
- company: Company name with platform in parentheses (e.g. "TechStartup (Wellfound)")
- location: City or "Remote"
- platform: One of "Wellfound", "LinkedIn", "Internshala", "Indeed", "Naukri", "Glassdoor"
- type: "Internship" or "Full-time"
- matchScore: Percentage match 0-100 based on how well candidate skills fit
- matchedSkills: Array of candidate skills that match this job
- missingSkills: Array of skills required but candidate doesn't have
- applyUrl: A realistic URL to the platform's job search page

Mix internships and full-time roles. Make them realistic and varied across different platforms. Sort by matchScore descending.

Return JSON only in this format:
{ "jobs": [ ... ] }`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let parsed = { jobs: [] };
        try {
            // More robust extraction: find the first { and the last }
            let jsonStr = text;
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
            
            if (startIndex !== -1 && endIndex !== -1) {
                jsonStr = text.slice(startIndex, endIndex + 1);
            }
            
            // Further cleanup: remove markdown code block ticks if they were inside the slice
            jsonStr = jsonStr.replace(/^```json\n/, '').replace(/```$/, '').trim();
            
            parsed = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON output:", parseError, text);
            // On parse error, we'll hit the catch block below and use template fallback
            throw new Error("Invalid JSON from AI");
        }

        const jobs = (parsed.jobs || []).sort((a, b) => b.matchScore - a.matchScore);

        return res.json({ jobs, platformLinks, source: 'ai' });

    } catch (error) {
        console.error('Job Finder Error:', error);
        // On any error, try fallback
        try {
            const latestCandidate = await Candidate.findOne().sort({ uploadedAt: -1 });
            const skills = latestCandidate?.skills || [];
            const jobs = generateFallbackJobs(skills);
            const platformLinks = buildPlatformLinks(skills);
            return res.json({ jobs, platformLinks, source: 'template' });
        } catch (e) {
            return res.status(500).json({ error: 'Failed to find jobs' });
        }
    }
});

export default router;
