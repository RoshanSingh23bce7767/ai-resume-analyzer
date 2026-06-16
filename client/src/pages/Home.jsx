import { useState, useEffect } from 'react';
import { analyzeResume, getCandidates } from '../services/api';
import UploadDropzone from '../components/UploadDropzone';
import AnalysisResult from '../components/AnalysisResult';
import { Link } from 'react-router-dom';
import { Loader2, Briefcase, FileSearch, FileText, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionContainer } from '../components/ui/SectionContainer';
import { UploadCard } from '../components/ui/UploadCard';
import { PrimaryButton } from '../components/ui/Button';
import { designSystem } from '../utils/designSystem';

const Home = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Try to load the most recent candidate analysis if we navigate back to this page
        const loadRecentAnalysis = async () => {
            try {
                const candidates = await getCandidates();
                if (candidates && candidates.length > 0) {
                    const latest = candidates[0];
                    setResult({
                        matchScore: latest.matchScore || latest.atsScore || 0,
                        atsScore: latest.atsScore || latest.matchScore || 0,
                        matchedSkills: latest.matchedSkills || latest.skills || [],
                        missingSkills: latest.missingSkills || [],
                        suggestions: latest.suggestions || []
                    });
                    if (latest.jobDescription) setJobDescription(latest.jobDescription);
                    if (latest.name) setFileName(latest.name + '.pdf');
                }
            } catch (err) {
                console.error("Could not load recent analysis", err);
            }
        };
        loadRecentAnalysis();
    }, []);

    const handleAnalyze = async () => {
        if (!file) {
            setError("Please upload a resume first.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await analyzeResume(file, jobDescription);
            setResult(response.data.analysis);
            setFileName(file.name);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred during analysis.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionContainer>
            <div className="text-center mb-12">
                <h1 className={`${designSystem.typography.pageTitle} text-4xl md:text-5xl font-extrabold tracking-tight mb-4`}>
                    Is Your Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">ATS-Ready?</span>
                </h1>
                <p className={`${designSystem.typography.body} text-lg max-w-2xl mx-auto`}>
                    Paste the target job description and upload your resume. Our AI will analyze your fit, highlight missing skills, and provide actionable feedback.
                </p>
            </div>

            <UploadCard className="max-w-3xl mx-auto">
                <div className="space-y-8">
                    {/* Job Description Textarea */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center dark:text-gray-100">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                            Paste Job Description
                        </label>
                        <textarea
                            rows={5}
                            placeholder="E.g., We are looking for a Software Engineer with experience in React, Node.js..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 outline-none transition-all hover:bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800 resize-none"
                        />
                    </div>

                    {/* Upload Area */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2 dark:text-gray-100">Resume Document (PDF)</label>
                        <UploadDropzone onFileSelect={setFile} />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <PrimaryButton
                        onClick={handleAnalyze}
                        disabled={loading || !file}
                        loading={loading}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2 animate-pulse">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Analyzing Resume with AI...</span>
                            </div>
                        ) : (
                            'Analyze Resume'
                        )}
                    </PrimaryButton>
                </div>
            </UploadCard>

            {/* Results Area */}
            {result && !loading && (
                <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
                    {/* Removed items-start so columns stretch to equal height */}
                    <div className="grid lg:grid-cols-2 gap-8 relative">
                        {/* Left Column (stretching to max height) */}
                        <div className="w-full">
                            {/* Sticky Content inside the column */}
                            <div className="flex flex-col w-full lg:sticky lg:top-8 z-10 pb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-full space-y-6"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <FileText className="w-6 h-6 mr-3 text-indigo-500" />
                                        Resume Preview
                                    </h3>
                                    <div className="w-full h-[600px] lg:h-[calc(100vh-8rem)] rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800/50">
                                        {file ? (
                                            <iframe
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full"
                                                title="Resume Preview"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500 dark:text-gray-400">
                                                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Previous Resume: {fileName || 'Analyzed'}</h4>
                                                <p className="text-sm max-w-sm">
                                                    The resume preview is only available immediately after a new upload. The analysis results on the right have been restored from your last session.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Analysis Results */}
                        <div className="flex flex-col w-full space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                            >
                                <AnalysisResult data={result} />

                                {/* Extracted Skills Visualization */}
                                {(result.matchedSkills?.length > 0 || result.missingSkills?.length > 0) && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="mt-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                                        <Cpu className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white">Extracted Skills from Resume</h4>
                                                        <p className="text-indigo-100 text-xs font-medium opacity-80">AI-detected skills powering your job recommendations</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                                    {(result.matchedSkills || []).length} skills found
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {(result.matchedSkills || []).map((skill, index) => (
                                                    <motion.span 
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.4 + (index * 0.04), duration: 0.3 }}
                                                        className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full border border-indigo-100 dark:border-indigo-800/50 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default"
                                                    >
                                                        <Sparkles className="w-3 h-3 mr-1.5 text-indigo-400" />
                                                        {skill}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {/* Call to Action for Job Finder */}
                                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                                    <div className="mb-4 sm:mb-0">
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">&quot;Find Jobs&quot; using these skills?</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Let AI find the perfect matches for you on real job boards.</p>
                                    </div>
                                    <Link 
                                        to="/job-finder" 
                                        className="whitespace-nowrap px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-colors"
                                    >
                                        Jump to Job Finder
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}
        </SectionContainer>
    );
};

export default Home;
