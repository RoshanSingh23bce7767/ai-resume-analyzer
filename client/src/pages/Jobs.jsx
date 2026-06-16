import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionContainer } from '../components/ui/SectionContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { DashboardCard } from '../components/ui/DashboardCard';
import { PrimaryButton } from '../components/ui/Button';
import { 
    Briefcase, Building2, Terminal, AlignLeft, CalendarClock, 
    Trash2, MapPin, ExternalLink, Link as LinkIcon, Sparkles,
    CheckCircle2, XCircle, Search, TrendingUp, Filter, BarChart3
} from 'lucide-react';
import { designSystem } from '../utils/designSystem';
import { getJobs, createJob, deleteJob, getJobRecommendations, getCandidates } from '../services/api';

const Jobs = () => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [applyUrl, setApplyUrl] = useState('');
    const [jobs, setJobs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [noSkillsError, setNoSkillsError] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await getJobs();
            setJobs(data);
            
            const candidatesData = await getCandidates();
            if (candidatesData && candidatesData.length > 0) {
                const latestCandidate = candidatesData[0];
                if (latestCandidate.skills && latestCandidate.skills.length > 0) {
                    setNoSkillsError(false);
                    const recs = await getJobRecommendations(latestCandidate.skills);
                    // Ensure sorting by matchScore
                    const sortedRecs = (recs.jobs || []).sort((a, b) => b.matchScore - a.matchScore);
                    setRecommendedJobs(sortedRecs);
                } else {
                    setNoSkillsError(true);
                }
            } else {
                setNoSkillsError(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job posting?")) return;
        try {
            await deleteJob(id);
            setJobs(jobs.filter(j => j._id !== id));
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newJob = await createJob({ title, company, skills, description, location, applyUrl });
            setJobs([newJob, ...jobs]);
            setTitle('');
            setCompany('');
            setSkills('');
            setDescription('');
            setLocation('');
            setApplyUrl('');
        } catch (error) {
            console.error("Error creating job:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
        if (score >= 40) return "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
        return "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";
    };

    const getProgressColor = (score) => {
        if (score >= 70) return "bg-emerald-500";
        if (score >= 40) return "bg-amber-500";
        return "bg-rose-500";
    };

    // Calculate dynamic stats
    const stats = {
        count: recommendedJobs.length,
        best: recommendedJobs.length > 0 ? Math.max(...recommendedJobs.map(j => j.matchScore)) : 0,
        average: recommendedJobs.length > 0 ? Math.round(recommendedJobs.reduce((acc, j) => acc + j.matchScore, 0) / recommendedJobs.length) : 0
    };

    return (
        <SectionContainer>
            <PageHeader
                title="Job Postings"
                subtitle="Create a new posting and track existing requisitions."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creation Sidebar */}
                <div className="lg:col-span-1">
                    <DashboardCard className="sticky top-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className={designSystem.typography.sectionHeading}>Create Job Posting</h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <div>
                                <label className="flex items-center space-x-2 mb-1.5 opacity-80">
                                    <Briefcase className="w-4 h-4" />
                                    <span>Job Title</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Software Engineer"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-xl p-3 outline-none transition-all shadow-sm focus:shadow-md"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 mb-1.5 opacity-80">
                                    <Building2 className="w-4 h-4" />
                                    <span>Company / Department</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Acme Corp"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-xl p-3 outline-none transition-all shadow-sm focus:shadow-md"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 mb-1.5 opacity-80">
                                    <MapPin className="w-4 h-4" />
                                    <span>Location</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Remote, San Francisco"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-xl p-3 outline-none transition-all shadow-sm focus:shadow-md"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 mb-1.5 opacity-80">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Apply URL (Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="e.g. https://company.com/apply"
                                    value={applyUrl}
                                    onChange={(e) => setApplyUrl(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-xl p-3 outline-none transition-all shadow-sm focus:shadow-md"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 mb-1.5 opacity-80">
                                    <Terminal className="w-4 h-4" />
                                    <span>Required Skills (CSV)</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. React, Node, SQL"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-xl p-3 outline-none transition-all shadow-sm focus:shadow-md"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 mb-1.5 opacity-80">
                                    <AlignLeft className="w-4 h-4" />
                                    <span>Job Description</span>
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Paste full description here..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-xl p-3 outline-none resize-none transition-all shadow-sm focus:shadow-md"
                                ></textarea>
                            </div>

                            <PrimaryButton type="submit" disabled={submitting} className="w-full group">
                                {submitting ? "Creating..." : "Create Job Post"}
                                <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                            </PrimaryButton>
                        </form>
                    </DashboardCard>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Postings */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className={designSystem.typography.sectionHeading}>Active Postings ({jobs.length})</h3>
                        </div>
                        
                        {jobs.length > 0 ? (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <motion.div 
                                        key={job._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                                    <span className="flex items-center space-x-1.5">
                                                        <Building2 className="w-4 h-4 text-indigo-500" />
                                                        <span>{job.company}</span>
                                                    </span>
                                                    {job.location && (
                                                        <span className="flex items-center space-x-1.5">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{job.location}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
                                                    {job.status || 'Active'}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    className="p-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                    title="Delete Posting"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 mb-4">
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Required Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {job.skills.split(',').map((skill, sIdx) => (
                                                    <span key={sIdx} className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded text-[11px] font-semibold">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs font-medium text-gray-400 dark:text-gray-500">
                                            <div className="flex items-center space-x-1.5">
                                                <CalendarClock className="w-4 h-4" />
                                                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <DashboardCard className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                                <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No jobs posted yet</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">Recommended jobs based on the candidate's resume are shown below.</p>
                            </DashboardCard>
                        )}
                    </div>

                    {/* RECOMENDATIONS SECTION */}
                    <div className="pt-4 space-y-6">
                        {/* Gradient Header */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-extrabold mb-2">Recommended Jobs for Candidate</h2>
                                <p className="text-indigo-100 font-medium opacity-90">Jobs matched based on candidate skills.</p>
                            </div>
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"></div>
                        </div>

                        {/* Stats Section */}
                        {!loading && recommendedJobs.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jobs Found</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.count}</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                                        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Best Match</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.best}%</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                                        <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Match</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.average}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skeleton Loading State */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse bg-white dark:bg-gray-800 h-80 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                                        <div className="space-y-3 flex-1 mt-auto">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty/Error States */}
                        {!loading && noSkillsError && (
                            <DashboardCard className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-4">
                                    <Search className="w-12 h-12 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No skills detected from resume</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">Upload a resume in the Analyzer section to get tailored job recommendations.</p>
                            </DashboardCard>
                        )}

                        {!loading && !noSkillsError && recommendedJobs.length === 0 && (
                            <DashboardCard className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-4">
                                    <Filter className="w-12 h-12 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching jobs found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">Try adding more skills to the resume or adjusting requirements.</p>
                            </DashboardCard>
                        )}

                        {/* Recommendation Grid */}
                        {!loading && recommendedJobs.length > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Top jobs matched based on your resume skills
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {recommendedJobs.map((job, idx) => (
                                    <motion.div 
                                        key={job._id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={job.title}>{job.title}</h4>
                                                <div className="mt-2 space-y-1.5">
                                                    <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        <Building2 className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                        <span className="truncate">{job.company}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                        <span className="truncate">{job.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Match Score */}
                                        <div className="mb-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getScoreColor(job.matchScore)}`}>
                                                    {job.matchScore}% Match
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${job.matchScore}%` }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 + (idx * 0.1) }}
                                                    className={`h-full rounded-full ${getProgressColor(job.matchScore)}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6 flex-1">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Matched Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.matchedSkills.length > 0 ? (
                                                        job.matchedSkills.slice(0, 3).map((skill, sIdx) => (
                                                            <span key={sIdx} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-md">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400 italic">No matches</span>
                                                    )}
                                                    {job.matchedSkills.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-900/50 text-gray-500 text-[10px] font-bold rounded-md">
                                                            +{job.matchedSkills.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Missing Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.missingSkills.length > 0 ? (
                                                        job.missingSkills.slice(0, 3).map((skill, sIdx) => (
                                                            <span key={sIdx} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold rounded-md">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Full Match
                                                        </span>
                                                    )}
                                                    {job.missingSkills.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-900/50 text-gray-500 text-[10px] font-bold rounded-md">
                                                            +{job.missingSkills.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {job.applyUrl ? (
                                            <a 
                                                href={job.applyUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none translate-y-0 active:translate-y-0.5"
                                            >
                                                Apply Now
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </a>
                                        ) : (
                                            <button 
                                                disabled 
                                                className="w-full inline-flex items-center justify-center px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-bold rounded-2xl cursor-not-allowed border border-gray-200 dark:border-gray-700"
                                            >
                                                Apply Link Not Available
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </SectionContainer>
    );
};

export default Jobs;
