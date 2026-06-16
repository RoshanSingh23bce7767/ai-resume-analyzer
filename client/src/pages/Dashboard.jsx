import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Info, RotateCw, FileText, Users, Star, Clock, MoreVertical, TrendingUp, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionContainer } from '../components/ui/SectionContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { DashboardCard } from '../components/ui/DashboardCard';
import { designSystem } from '../utils/designSystem';

import { getCandidates, getAnalytics } from '../services/api';

const fetchDashboardData = async () => {
    const [candidates, analytics] = await Promise.all([
        getCandidates(),
        getAnalytics()
    ]);

    const total = candidates.length;
    const avg = total > 0 ? Math.round(candidates.reduce((acc, c) => acc + (c.matchScore || c.atsScore || 0), 0) / total) : 0;

    return {
        totalResumes: total,
        avgScore: avg,
        topSkills: analytics.topSkills || [],
        monthlyData: analytics.monthlyUploads || []
    };
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
    const { data: stats, isLoading, mutate } = useSWR('dashboardData', fetchDashboardData, {
        revalidateOnFocus: false
    });

    const isMutating = isLoading || !stats;

    return (
        <SectionContainer>
            {/* Header section */}
            <PageHeader
                title="ATS Resume Analyzer"
                subtitle="AI-powered recruitment insights and candidate analysis."
                rightElement={
                    <>
                        <button onClick={() => mutate()} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors font-medium">
                            <RotateCw className={`w-5 h-5 ${isMutating ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-4 py-2 rounded-full font-medium">
                            Live API active
                        </div>
                    </>
                }
            />

            {/* KPI Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Card 1 */}
                <motion.div variants={itemVariants}>
                    <DashboardCard className="flex flex-col justify-between h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-green-500 dark:text-green-400 text-xs font-semibold flex items-center bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +12%
                            </span>
                        </div>
                        {isMutating ? (
                            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                        ) : (
                            <div>
                                <h4 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalResumes}</h4>
                                <p className={designSystem.typography.body + " mt-1"}>Total Resumes</p>
                            </div>
                        )}
                    </DashboardCard>
                </motion.div>

                {/* Card 2 */}
                <motion.div variants={itemVariants}>
                    <DashboardCard className="flex flex-col justify-between h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-green-500 dark:text-green-400 text-xs font-semibold flex items-center bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8%
                            </span>
                        </div>
                        {isMutating ? (
                            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                        ) : (
                            <div>
                                <h4 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalResumes}</h4>
                                <p className={designSystem.typography.body + " mt-1"}>Analyzed Candidates</p>
                            </div>
                        )}
                    </DashboardCard>
                </motion.div>

                {/* Card 3 */}
                <motion.div variants={itemVariants}>
                    <DashboardCard className="flex flex-col justify-between h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                                <Star className="w-5 h-5" />
                            </div>
                            <span className="text-green-500 dark:text-green-400 text-xs font-semibold flex items-center bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +5%
                            </span>
                        </div>
                        {isMutating ? (
                            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                        ) : (
                            <div>
                                <h4 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</h4>
                                <p className={designSystem.typography.body + " mt-1"}>Avg. Match Score</p>
                            </div>
                        )}
                    </DashboardCard>
                </motion.div>

                {/* Card 4 */}
                <motion.div variants={itemVariants}>
                    <DashboardCard className="flex flex-col justify-between h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-green-500 dark:text-green-400 text-xs font-semibold flex items-center bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                                <Zap className="w-3 h-3 mr-1" />
                                Fast
                            </span>
                        </div>
                        {isMutating ? (
                            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                        ) : (
                            <div>
                                <h4 className="text-3xl font-bold text-gray-900 dark:text-white">&lt; 1s</h4>
                                <p className={designSystem.typography.body + " mt-1"}>Avg. Processing Time</p>
                            </div>
                        )}
                    </DashboardCard>
                </motion.div>
            </motion.div>

            {/* Grid for charts */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {/* Left Chart Panel */}
                <DashboardCard className="h-96 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className={designSystem.typography.sectionHeading}>Monthly Applications</h3>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 w-full relative -ml-4">
                        {isMutating ? (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#E2E8F0' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="resumes"
                                        stroke="#6366F1"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366F1' }}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#6366F1' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </DashboardCard>

                {/* Right Skills Panel */}
                <DashboardCard className="h-96 flex flex-col hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex justify-between items-start mb-6 shrink-0">
                        <h3 className={designSystem.typography.sectionHeading}>Top Skills Detected</h3>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {isMutating ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-12 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
                                ))}
                            </div>
                        ) : stats.topSkills.length > 0 ? (
                            <div className="w-full space-y-3">
                                {stats.topSkills.map((skill, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        key={idx}
                                        className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{skill.name}</span>
                                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                                            {skill.value} candidates
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 flex items-center justify-center rounded-full mb-3">
                                    <Star className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                                </div>
                                <p className={designSystem.typography.body + " font-medium"}>No skills detected yet</p>
                                <p className="text-xs mt-1 text-gray-500">Upload resumes to see analytics</p>
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </motion.div>
        </SectionContainer>
    );
};

export default Dashboard;
