import { designSystem } from '../../utils/designSystem';

export const DashboardCard = ({ children, className = "" }) => {
    return (
        <div className={`${designSystem.card.base} ${className}`}>
            {children}
        </div>
    );
};
