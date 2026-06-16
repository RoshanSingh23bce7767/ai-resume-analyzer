import useSWR from 'swr';
import { motion } from 'framer-motion';
import { SectionContainer } from '../components/ui/SectionContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { DashboardCard } from '../components/ui/DashboardCard';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { designSystem } from '../utils/designSystem';
import { getAnalytics } from '../services/api';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B'];

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

const Analytics = () => {
    const { data, isLoading } = useSWR('analyticsData', getAnalytics, {
        revalidateOnFocus: false
    });

    const isMutating = isLoading || !data;

    const monthlyData = data?.monthlyUploads || [];
    const scoreDistData = data?.scoreDistribution || [];
    const topSkillsData = data?.topSkills || [];

    return (
        <SectionContainer>
            <PageHeader
                title="Analytics & insights"
                subtitle="Deep dive into your resume evaluation metrics."
            />

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Monthly Uploads */}
                <motion.div variants={itemVariants} className="h-full">
                    <DashboardCard className="h-96 flex flex-col hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className={designSystem.typography.sectionHeading}>Monthly Resumes Analyzed</h3>
                            <p className={designSystem.typography.body}>Volume of resumes processed over time</p>
                        </div>
                        <div className="flex-1 w-full relative -ml-4">
                            {isMutating ? (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorResumes" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                        <RTTooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1E293B', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '3 3' }}
                                        />
                                        <Area type="monotone" dataKey="resumes" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorResumes)" activeDot={{ r: 6, strokeWidth: 0, fill: '#8B5CF6' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </DashboardCard>
                </motion.div>

                {/* Score Distribution */}
                <motion.div variants={itemVariants} className="h-full">
                    <DashboardCard className="h-96 flex flex-col hover:shadow-md transition-shadow">
                        <div className="mb-6">
                            <h3 className={designSystem.typography.sectionHeading}>Match Score Distribution</h3>
                            <p className={designSystem.typography.body}>Breakdown of candidate quality by match score</p>
                        </div>
                        <div className="flex-1 w-full relative -ml-4">
                            {isMutating ? (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={scoreDistData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                        <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                        <RTTooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1E293B', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </DashboardCard>
                </motion.div>

                {/* Top Skills Detected */}
                <motion.div variants={itemVariants} className="h-full lg:col-span-2">
                    <DashboardCard className="h-96 flex flex-col hover:shadow-md transition-shadow">
                        <div className="mb-6 flex flex-col items-center">
                            <h3 className={designSystem.typography.sectionHeading}>Top Skills Detected</h3>
                            <p className={designSystem.typography.body}>Most frequent core competencies among candidates</p>
                        </div>
                        <div className="flex-1 w-full md:w-1/2 mx-auto relative flex items-center justify-center">
                            {isMutating ? (
                                <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full"></div>
                            ) : topSkillsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topSkillsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {topSkillsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RTTooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1E293B', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-gray-500 dark:text-gray-400 text-sm">No skill data available</div>
                            )}
                        </div>
                    </DashboardCard>
                </motion.div>
            </motion.div>
        </SectionContainer>
    );
};

export default Analytics;
