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
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Full GUCI-based verification response from the backend */
export interface VerifyDegreeResponse {
  globalCredentialId: string;   // e.g. "MUET-22CS001"
  universityCode: string;       // e.g. "MUET"
  rollNo: string;               // e.g. "22CS001"
  status: string;               // VERIFIED | TAMPERED | NOT_FOUND | ERROR
  message: string;
  studentName: string;
  fatherName: string;
  department: string;
  cgpa: string;
  dataHash: string;             // SHA-256 of (rollNo|studentName|cgpa|universityCode)
  ipfsCid: string;
  issuerAddress: string;
  issueDate: number;            // Unix epoch seconds
  verified: boolean;
  authentic: boolean;
  tampered: boolean;
  integrityMessage: string;
  verificationUrl: string;      // https://yourdomain.com/verify?id=MUET-22CS001
  qrCodeBase64: string | null;  // Base64-encoded QR code PNG
  revoked?: boolean;
  revocationReason?: string;
  revocationDate?: number;
  revocationTxHash?: string;
}

/** Complete database record for the admin ledger */
export interface DegreeRecord {
  globalCredentialId: string;
  universityCode: string;
  rollNo: string;
  studentId?: string;
  studentName: string;
  fatherName?: string;
  department?: string;
  cgpa: string;
  dataHash: string;
  ipfsCid: string;
  issuerAddress: string;
  issueDate: number;
  revoked?: boolean;
  revocationReason?: string;
  revocationDate?: number;
  revocationTxHash?: string;
}

/** Response returned by the single-degree issuance endpoint */
export interface IssueTransactionResponse {
  transactionHash: string;
  status: string;
  message: string;
  issuerAddress: string | null;
  globalCredentialId: string;   // e.g. "MUET-22CS001"
  verificationUrl: string;      // public verification URL
  qrCodeBase64: string | null;  // Base64-encoded QR code PNG
}

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
  return data as {
    totalDegreesIssued: number;
    maxBatchSize: number;
    totalRevoked?: number;
    activeDegrees?: number;
  };
};

/** GET /api/v1/degrees/all — Fetch all issued degrees for the admin ledger */
export const getAllDegrees = async (): Promise<DegreeRecord[]> => {
  const { data } = await api.get('/degrees/all');
  return data as DegreeRecord[];
};

/** GET /api/v1/degrees/search?q=... — Search degrees by query */
export const searchDegrees = async (query: string): Promise<DegreeRecord[]> => {
  const { data } = await api.get(`/degrees/search?q=${encodeURIComponent(query)}`);
  return data as DegreeRecord[];
};

/** POST /api/v1/degrees/revoke — Revoke a degree on-chain */
export const revokeDegree = async (globalCredentialId: string, reason: string) => {
  const { data } = await api.post('/degrees/revoke', { globalCredentialId, reason });
  return data as { transactionHash: string; status: string; message: string };
};

/**
 * GET /api/v1/degrees/verify/{globalCredentialId}
 *
 * Verifies a credential by its GUCI (no file upload required).
 * The backend recomputes the data hash from on-chain fields and compares.
 *
 * @param globalCredentialId  e.g. "MUET-22CS001"
 */
export const verifyDegree = async (globalCredentialId: string): Promise<VerifyDegreeResponse> => {
  const { data } = await api.get(`/degrees/verify/${encodeURIComponent(globalCredentialId)}`);
  return data as VerifyDegreeResponse;
};

/**
 * POST /api/v1/degrees/issue (multipart: file + data JSON)
 *
 * Issues a single degree credential. The backend:
 * 1. Derives the GUCI = universityCode + "-" + rollNo
 * 2. Computes SHA-256 data hash
 * 3. Uploads PDF to IPFS
 * 4. Anchors hash on blockchain
 * 5. Returns QR code and verification URL
 */
export const issueSingleDegree = async (
  file: File,
  data: {
    universityCode: string;
    rollNo: string;
    studentName: string;
    fatherName: string;
    department: string;
    cgpa: string;
  }
): Promise<IssueTransactionResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  const { data: response } = await api.post('/degrees/issue', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response as IssueTransactionResponse;
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
