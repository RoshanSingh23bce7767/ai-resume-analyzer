import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';

const UploadDropzone = ({ onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type === 'application/pdf') {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            onFileSelect(file);
        } else {
            alert("Please upload a PDF file");
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full">
            <div
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ${dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/80'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".pdf"
                />

                {selectedFile ? (
                    <div className="flex w-full h-full items-center justify-between z-10 rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4">
                        <div className="w-1/2 h-full flex items-center justify-center border-r border-gray-200 dark:border-gray-700 pr-4">
                            {previewUrl ? (
                                <object data={previewUrl} type="application/pdf" className="w-full h-full rounded-lg shadow-sm" aria-label="Resume Preview" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                    <File className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center justify-center w-1/2 pl-4 text-center">
                            <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100 truncate w-full px-2" title={selectedFile.name}>{selectedFile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                                onClick={removeFile}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors z-20"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove File</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transition-transform hover:scale-110">
                            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PDF files only (Max 5MB)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadDropzone;
