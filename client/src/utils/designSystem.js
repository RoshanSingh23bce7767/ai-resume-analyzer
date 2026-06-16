export const designSystem = {
    layout: {
        wrapper: "max-w-7xl mx-auto px-6 py-8 w-full",
        container: "space-y-6 md:space-y-8",
    },
    card: {
        base: "bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm",
        elevated: "bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-700 shadow-xl",
    },
    typography: {
        pageTitle: "text-3xl font-semibold text-gray-900 dark:text-white",
        sectionHeading: "text-xl font-medium text-gray-800 dark:text-gray-100",
        body: "text-sm text-gray-500 dark:text-gray-400",
    },
    button: {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:shadow-none hover:shadow-md",
        disabled: "bg-gray-300 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed",
    }
};
