import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionContainer } from '../components/ui/SectionContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { DashboardCard } from '../components/ui/DashboardCard';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Search, Filter, Users as UsersIcon, Trash2, Eye, X } from 'lucide-react';
import { designSystem } from '../utils/designSystem';
import { getCandidates, deleteCandidate } from '../services/api';
import AnalysisResult from '../components/AnalysisResult';

const Candidates = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterScore, setFilterScore] = useState('all');

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await getCandidates();
                setCandidates(data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this candidate?")) return;
        try {
            await deleteCandidate(id);
            setCandidates(candidates.filter(c => c._id !== id));
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    };

    // Filter logic
    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.matchedSkills && c.matchedSkills.join(',').toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.skills && c.skills.join(',').toLowerCase().includes(searchTerm.toLowerCase()));

        const score = c.matchScore || c.atsScore || 0;
        let matchesScore = true;
        if (filterScore === 'high') matchesScore = score >= 80;
        else if (filterScore === 'medium') matchesScore = score >= 50 && score < 80;
        else if (filterScore === 'low') matchesScore = score < 50;

        return matchesSearch && matchesScore;
    });

    return (
        <SectionContainer>
            <PageHeader
                title="Candidates"
                subtitle="Manage and review analyzed resumes."
                rightElement={
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterScore}
                                onChange={(e) => setFilterScore(e.target.value)}
                                className="pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                            >
                                <option value="all">All Scores</option>
                                <option value="high">&ge; 80 (High)</option>
                                <option value="medium">&ge; 50 (Medium)</option>
                                <option value="low">&lt; 50 (Low)</option>
                            </select>
                        </div>
                    </div>
                }
            />

            <DashboardCard className="p-0 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : filteredCandidates.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                        <Table headers={["Candidate Name", "Email", "Match Score", "Top Skills", "Upload Date", "Status", "Actions"]}>
                            {filteredCandidates.map((c, i) => {
                                const matchScore = c.matchScore || c.atsScore || 0;
                                const skillsList = c.matchedSkills?.length > 0 ? c.matchedSkills : c.skills;
                                return (
                                    <TableRow key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{c.name}</TableCell>
                                        <TableCell className="text-gray-500 dark:text-gray-400">{c.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${matchScore >= 80 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                                                matchScore >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' :
                                                    'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                }`}>
                                                {matchScore}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="truncate max-w-xs">{skillsList?.length > 0 ? skillsList.join(', ') : 'N/A'}</TableCell>
                                        <TableCell className="text-gray-500 dark:text-gray-400">{new Date(c.uploadedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                                {c.status || 'Analyzed'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedCandidate(c)}
                                                    className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c._id)}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Delete Candidate"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700">
                            <UsersIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className={designSystem.typography.sectionHeading + " mb-2"}>No candidates analyzed yet</h3>
                        <p className={designSystem.typography.body + " max-w-sm"}>
                            Upload and analyze resumes to see candidates appear in this list along with their matching scores and skill fit.
                        </p>
                    </div>
                )}
            </DashboardCard>

            {/* Candidate Details Modal */}
            <AnimatePresence>
                {selectedCandidate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 dark:border-gray-800"
                        >
                            <div className="sticky top-0 right-0 z-10 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCandidate.name}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{selectedCandidate.email}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCandidate(null)}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <AnalysisResult data={selectedCandidate} />

                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Target Job Description</h3>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {selectedCandidate.jobDescription || "No job description provided for this candidate."}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </SectionContainer>
    );
};

export default Candidates;
