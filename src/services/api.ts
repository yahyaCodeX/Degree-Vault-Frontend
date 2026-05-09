import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Accept': 'application/json',
  },
});

// ── Request interceptor — attach JWT token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — handle 401 globally ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dv_token');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** POST /api/v1/auth/login */
export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

/** GET /api/v1/degrees/stats */
export const getStats = async () => {
  const { data } = await api.get('/degrees/stats');
  return data as { totalDegreesIssued: number; maxBatchSize: number };
};

/** POST /api/v1/degrees/verify/{degreeId} (multipart) */
export const verifyDegree = async (degreeId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/degrees/verify/${degreeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

/** POST /api/v1/degrees/issue (multipart: file + data JSON) */
export const issueSingleDegree = async (
  file: File,
  data: {
    degreeId: string;
    studentId: string;
    studentName: string;
    fatherName: string;
    department: string;
    cgpa: string;
  }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  const { data: response } = await api.post('/degrees/issue', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response as { transactionHash: string; status: string; message: string; issuerAddress: string | null };
};

/** POST /api/v1/degrees/issue/batch (multipart: csvFile + zipFile) */
export const issueBatch = async (csvFile: File, zipFile: File) => {
  const formData = new FormData();
  formData.append('csvFile', csvFile);
  formData.append('zipFile', zipFile);
  const { data } = await api.post('/degrees/issue/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data as { batchId: string; message: string; statusUrl: string };
};

/** GET /api/v1/degrees/batch/{batchId}/status */
export const getBatchStatus = async (batchId: string) => {
  const { data } = await api.get(`/degrees/batch/${batchId}/status`);
  return data;
};

/** GET /api/v1/degrees/health */
export const healthCheck = async () => {
  const { data } = await api.get('/degrees/health');
  return data;
};

export default api;
