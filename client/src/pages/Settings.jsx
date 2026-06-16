import { useState, useEffect } from 'react';
import { SectionContainer } from '../components/ui/SectionContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { DashboardCard } from '../components/ui/DashboardCard';
import { PrimaryButton } from '../components/ui/Button';
import { User, Mail, Moon, Sun, KeyRound, ShieldCheck } from 'lucide-react';
import { designSystem } from '../utils/designSystem';
import { getSettings, updateSettings } from '../services/api';
import { useTheme } from '../hooks/useTheme';

const Settings = () => {
    const [name, setName] = useState('Roshan Singh');
    const [email, setEmail] = useState('roshan@example.com');
    const [theme, setTheme] = useTheme();
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                if (data && data.geminiApiKey) {
                    setApiKey(data.geminiApiKey);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateSettings({ geminiApiKey: apiKey });
            // Add UI notification logic here if needed
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionContainer>
            <PageHeader
                title="Account Settings"
                subtitle="Manage your profile, preferences, and API configuration."
            />

            <div className="max-w-3xl space-y-6">
                <DashboardCard>
                    <h3 className={designSystem.typography.sectionHeading + " mb-6 flex items-center gap-2"}>
                        <User className="w-5 h-5 text-indigo-500" />
                        Profile Information
                    </h3>
                    <form className="space-y-4" onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9 pr-4 py-2 w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 pr-4 py-2 w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </DashboardCard>

                <DashboardCard>
                    <h3 className={designSystem.typography.sectionHeading + " mb-6 flex items-center gap-2"}>
                        <Moon className="w-5 h-5 text-indigo-500" />
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Theme Preference</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
                        </div>
                        <div className="flex bg-gray-200 dark:bg-gray-900 p-1 rounded-lg">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <Sun className="w-4 h-4" /> Light
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                <Moon className="w-4 h-4" /> Dark
                            </button>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard>
                    <h3 className={designSystem.typography.sectionHeading + " mb-6 flex items-center gap-2"}>
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        AI Settings & API
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Google Gemini API Key
                            </label>
                            <div className="relative">
                                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="pl-9 pr-4 py-2 w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Your API key is encrypted and stored securely. Used for ATS scoring and skill detection.
                            </p>
                        </div>
                    </div>
                </DashboardCard>

                <div className="flex justify-end pt-4">
                    <PrimaryButton onClick={handleSave} disabled={loading} className="w-auto md:w-auto px-8 py-3">
                        {loading ? 'Saving Changes...' : 'Save Settings'}
                    </PrimaryButton>
                </div>
            </div>
        </SectionContainer>
    );
};

export default Settings;
