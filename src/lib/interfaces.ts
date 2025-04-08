export interface DiagnosticsType {
    osType: 'macOS' | 'Windows' | 'Linux'; // OS type
    gpu?: {
        name: string;
        memory: number; // Memory in MB
        type: 'integrated' | 'dedicated';
        supportsCUDA: boolean; // Whether the GPU supports CUDA
    };
    cpu?: {
        name: string;
        cores: number;
        threads: number;
        architecture: string;
    };
    memory?: {
        total: number; // Total memory in MB
        used: number; // Used memory in MB
        free: number; // Free memory in MB
    };
    storage?: {
        total: number; // Total storage in MB
        used: number; // Used storage in MB
        free: number; // Free storage in MB
    };
    os?: {
        name: string;
        version: string;
        architecture: string;
    };
}

export interface DeviceDiagnostics {
    macAddress: string;
    compute: DiagnosticsType;
    type: 'nogpu' | 'gpu';
}