import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/analyze';

export const analyzeDocument = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 180000, // 3 minutes
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            return {
                success: false,
                error: 'Analysis timed out (3 min limit)',
                type: 'timeout',
            };
        } else if (error.code === 'ERR_NETWORK') {
            return {
                success: false,
                error: 'Could not connect to backend. Make sure it is running on http://127.0.0.1:8000',
                type: 'connection',
            };
        } else {
            return {
                success: false,
                error: error.response?.data?.detail || error.message || 'An unexpected error occurred',
                type: 'error',
            };
        }
    }
};


export const fetchHistory = async () => {
    try {
        const response = await axios.get(`${API_URL.replace('/analyze', '')}/history`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const fetchAnalysisById = async (id) => {
    try {
        const response = await axios.get(`${API_URL.replace('/analyze', '')}/history/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export default {
    analyzeDocument,
    fetchHistory,
    fetchAnalysisById
};
