import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

const AnalysisResult = ({ data }) => {
    if (!data) return null;

    const matchScore = data.matchScore || data.atsScore || 0;
    const matchedSkills = data.matchedSkills || data.skillsFound || [];
    const missingSkills = data.missingSkills || [];
    const suggestions = data.suggestions || [];

    // Circular Progress Chart calculations
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (matchScore / 100) * circumference;

    let scoreColor = "text-red-500 stroke-red-500 dark:text-red-400 dark:stroke-red-400";
    if (matchScore >= 80) {
        scoreColor = "text-green-500 stroke-green-500 dark:text-green-400 dark:stroke-green-400";
    } else if (matchScore >= 60) {
        scoreColor = "text-yellow-500 stroke-yellow-500 dark:text-yellow-400 dark:stroke-yellow-400";
    }

    // Helper to format basic markdown like **bold** in the feedback text
    const formatText = (text) => {
        if (!text) return text;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} className="font-bold text-gray-900 dark:text-white">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Match Score Card */}
            <div className="glass rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Job Match Analysis
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Detailed breakdown of how your resume fits the job description.</p>
                </div>

                <div className="flex flex-col items-center justify-center relative">
                    <svg className="w-36 h-36 transform -rotate-90">
                        <circle
                            className="text-gray-100 dark:text-gray-700 stroke-current"
                            strokeWidth="12"
                            cx="72"
                            cy="72"
                            r="50"
                            fill="transparent"
                        ></circle>
                        <circle
                            className={`${scoreColor} transition-all duration-1000 ease-out`}
                            strokeWidth="12"
                            strokeLinecap="round"
                            cx="72"
                            cy="72"
                            r="50"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className={`text-4xl font-extrabold ${scoreColor.split(' ')[0]}`}>{matchScore}%</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/80">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Matched Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-medium rounded-full border border-green-200 dark:border-green-500/20 shadow-sm">
                                {skill}
                            </span>
                        ))}
                        {matchedSkills.length === 0 && <span className="text-gray-500 dark:text-gray-400 italic">No exact skill matches found.</span>}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/80">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Missing Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-medium rounded-full border border-red-200 dark:border-red-500/20 shadow-sm">
                                {skill}
                            </span>
                        ))}
                        {missingSkills.length === 0 && <span className="text-green-600 dark:text-green-400 font-medium">No missing key skills! Great job.</span>}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/80">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recommendations</h3>
                </div>
                <ul className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-50 dark:border-blue-900/20 transition-all hover:shadow-md">
                            <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                {formatText(suggestion)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AnalysisResult;
