import { designSystem } from '../../utils/designSystem';

export const SectionContainer = ({ children, className = "" }) => {
    return (
        <div className={`${designSystem.layout.container} ${className}`}>
            {children}
        </div>
    );
};
