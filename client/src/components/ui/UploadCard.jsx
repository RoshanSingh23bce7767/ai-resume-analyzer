import { designSystem } from '../../utils/designSystem';

export const UploadCard = ({ children, className = "" }) => {
    return (
        <div className={`${designSystem.card.base} md:p-10 ${className}`}>
            {children}
        </div>
    );
};
