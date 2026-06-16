import { designSystem } from '../../utils/designSystem';

export const PageHeader = ({ title, subtitle, rightElement, className = "" }) => {
    return (
        <div className={`flex justify-between items-start mb-6 ${className}`}>
            <div>
                <h1 className={`${designSystem.typography.pageTitle} mb-1`}>{title}</h1>
                {subtitle && <p className={designSystem.typography.body}>{subtitle}</p>}
            </div>
            {rightElement && (
                <div className="flex items-center space-x-3">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
