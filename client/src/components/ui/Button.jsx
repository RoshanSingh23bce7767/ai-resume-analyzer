import { designSystem } from '../../utils/designSystem';

export const PrimaryButton = ({ children, onClick, disabled, className = "", loading }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold flex justify-center items-center transition-all duration-200 ${disabled || loading
                    ? designSystem.button.disabled
                    : designSystem.button.primary
                } ${className}`}
        >
            {children}
        </button>
    );
};

export const SecondaryButton = ({ children, onClick, disabled, className = "" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${disabled
                    ? designSystem.button.disabled
                    : designSystem.button.secondary
                } ${className}`}
        >
            {children}
        </button>
    );
};
