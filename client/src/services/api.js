import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-22f8.onrender.com/api';

export const analyzeResume = async (file, jobDescription) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    const response = await axios.post(`${API_BASE_URL}/resume/analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getCandidates = async () => {
    const response = await axios.get(`${API_BASE_URL}/candidates`);
    return response.data;
};

export const getCandidateById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/candidates/${id}`);
    return response.data;
};

export const deleteCandidate = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/candidates/${id}`);
    return response.data;
};

export const getJobs = async () => {
    const response = await axios.get(`${API_BASE_URL}/jobs`);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await axios.post(`${API_BASE_URL}/jobs`, jobData);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/jobs/${id}`);
    return response.data;
};

export const getJobRecommendations = async (skillsArray) => {
    const skillsParam = skillsArray.join(',');
    const response = await axios.get(`${API_BASE_URL}/jobs/recommended?skills=${encodeURIComponent(skillsParam)}`);
    return response.data;
};

export const findJobs = async () => {
    const response = await axios.get(`${API_BASE_URL}/job-finder`);
    return response.data;
};

export const getAnalytics = async () => {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
};

export const getSettings = async () => {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    return response.data;
};

export const updateSettings = async (settingsData) => {
    const response = await axios.post(`${API_BASE_URL}/settings`, settingsData);
    return response.data;
};
