import React, { useState, useEffect } from "react";
import styles from "./Diagnostics.module.css";
import { platform } from "@tauri-apps/plugin-os";
import { Command } from "@tauri-apps/plugin-shell";
import { load } from "@tauri-apps/plugin-store";

interface DiagnosticsData {
    memory: string;
    gpu: string;
    storage: string;
    os: string;
}

export interface DiagnosticsType {
    osType: "macOS" | "Windows" | "Linux"; // OS type
    gpu?: {
        name: string;
        memory: number; // Memory in MB
        type: "integrated" | "dedicated";
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
    compute: DiagnosticsType;
    type: "nogpu" | "gpu";
}

const Diagnostics: React.FC = () => {
    const [data, setData] = useState<DiagnosticsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function runDiagnostics() {
            try {
                const currentPlatform = await platform();
                console.log("Platform:", currentPlatform);
                
                // Variables for displaying diagnostics in the UI.
                let memoryDisplay = "";
                let gpuDisplay = "";
                let storageDisplay = "";
                let osDisplay = "";

                // Variables used to build the DeviceDiagnostics object.
                let totalMemoryMB = 0;
                let gpuMemoryMB: number | null = null;
                let freeStorageMB = 0;
                let osName = "";
                let osVersion = "";

                if (currentPlatform === "macos") {
                    // Get total memory from sysctl (in bytes) then convert to MB.
                    const memCmd = await Command.create("exec-sh", [
                        "-c",
                        "sysctl -n hw.memsize"
                    ]);
                    const memRes = await memCmd.execute();
                    const totalMemoryBytes = parseInt(memRes.stdout.trim(), 10);
                    totalMemoryMB = Math.round(totalMemoryBytes / 1048576);
                    memoryDisplay = `${totalMemoryMB} MB`;

                    // Get GPU memory using system_profiler.
                    const gpuCmd = await Command.create("exec-sh", [
                        "-c",
                        `system_profiler SPDisplaysDataType | grep -i "VRAM (MB)" | head -n 1 | awk '{print $NF}'`
                    ]);
                    const gpuRes = await gpuCmd.execute();
                    const parsedGpu = parseInt(gpuRes.stdout.trim(), 10);
                    if (!isNaN(parsedGpu)) {
                        gpuMemoryMB = parsedGpu;
                        gpuDisplay = `${parsedGpu} MB`;
                    } else {
                        gpuDisplay = "N/A";
                    }

                    // Get free storage (in MB) for the root volume.
                    const storageCmd = await Command.create("exec-sh", [
                        "-c",
                        "df -m / | tail -1 | awk '{print $4}'"
                    ]);
                    const storageRes = await storageCmd.execute();
                    freeStorageMB = parseInt(storageRes.stdout.trim(), 10);
                    storageDisplay = `${freeStorageMB} MB`;

                    // Get OS details.
                    const osNameCmd = await Command.create("exec-sh", [
                        "-c",
                        "sw_vers -productName"
                    ]);
                    const osVerCmd = await Command.create("exec-sh", [
                        "-c",
                        "sw_vers -productVersion"
                    ]);
                    osName = (await osNameCmd.execute()).stdout.trim();
                    osVersion = (await osVerCmd.execute()).stdout.trim();
                    osDisplay = `${osName} ${osVersion}`;
                } else if (currentPlatform === "linux") {
                    // Get total memory from /proc/meminfo (in kB) then convert to MB.
                    const memCmd = await Command.create("exec-sh", [
                        "-c",
                        "grep MemTotal /proc/meminfo | awk '{print $2}'"
                    ]);
                    const memRes = await memCmd.execute();
                    totalMemoryMB = Math.round(parseInt(memRes.stdout.trim(), 10) / 1024);
                    memoryDisplay = `${totalMemoryMB} MB`;

                    // GPU information is often not available.
                    gpuDisplay = "N/A";

                    // Get free storage (in MB).
                    const storageCmd = await Command.create("exec-sh", [
                        "-c",
                        "df -m / | tail -1 | awk '{print $4}'"
                    ]);
                    const storageRes = await storageCmd.execute();
                    freeStorageMB = parseInt(storageRes.stdout.trim(), 10);
                    storageDisplay = `${freeStorageMB} MB`;

                    // Get OS information from /etc/os-release.
                    const osCmd = await Command.create("exec-sh", [
                        "-c",
                        `grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '"'`
                    ]);
                    osDisplay = (await osCmd.execute()).stdout.trim();
                    // For Linux, assign the entire pretty name to osName.
                    osName = osDisplay;
                    osVersion = "unknown";
                } else if (currentPlatform === "windows") {
                    // Get total memory from WMIC (in bytes) then convert to MB.
                    const memCmd = await Command.create("exec-sh", [
                        "-c",
                        `wmic ComputerSystem get TotalPhysicalMemory | findstr /r /v "^$" | tail -n1`
                    ]);
                    const memRes = await memCmd.execute();
                    totalMemoryMB = Math.round(parseInt(memRes.stdout.trim(), 10) / (1024 * 1024));
                    memoryDisplay = `${totalMemoryMB} MB`;

                    // Get GPU memory from WMIC.
                    const gpuCmd = await Command.create("exec-sh", [
                        "-c",
                        `wmic path win32_VideoController get AdapterRAM | findstr /r /v "^$" | tail -n1`
                    ]);
                    const gpuRes = await gpuCmd.execute();
                    const parsedGpu = parseInt(gpuRes.stdout.trim(), 10);
                    if (!isNaN(parsedGpu) && parsedGpu > 0) {
                        gpuMemoryMB = Math.round(parsedGpu / (1024 * 1024));
                        gpuDisplay = `${gpuMemoryMB} MB`;
                    } else {
                        gpuDisplay = "N/A";
                    }

                    // Get free storage (in bytes) for the C: drive then convert to MB.
                    const storageCmd = await Command.create("exec-sh", [
                        "-c",
                        `wmic logicaldisk where DeviceID='C:' get FreeSpace | findstr /r /v "^$" | tail -n1`
                    ]);
                    const storageRes = await storageCmd.execute();
                    freeStorageMB = Math.round(parseInt(storageRes.stdout.trim(), 10) / (1024 * 1024));
                    storageDisplay = `${freeStorageMB} MB`;

                    // Get OS details via WMIC.
                    const osCmd = await Command.create("exec-sh", [
                        "-c",
                        `wmic os get Caption /value`
                    ]);
                    const osRes = await osCmd.execute();
                    const osInfo = osRes.stdout.split("=")[1]?.trim() || "Unknown OS";
                    osDisplay = osInfo;
                    osName = osInfo;
                    osVersion = "unknown";
                } else {
                    setError("Unsupported platform for diagnostics.");
                    return;
                }

                // Update the UI state with formatted diagnostic strings.
                setData({
                    memory: memoryDisplay,
                    gpu: gpuDisplay,
                    storage: storageDisplay,
                    os: osDisplay,
                });

                // Build the DeviceDiagnostics object.
                const deviceDiagnostics: DeviceDiagnostics = {
                    compute: {
                        osType:
                            currentPlatform === "macos"
                                ? "macOS"
                                : currentPlatform === "windows"
                                ? "Windows"
                                : "Linux",
                        memory: { total: totalMemoryMB, used: 0, free: totalMemoryMB },
                        storage: { total: freeStorageMB, used: 0, free: freeStorageMB },
                        os: { name: osName, version: osVersion, architecture: "unknown" },
                        ...(gpuMemoryMB !== null && !isNaN(gpuMemoryMB)
                            ? {
                                    gpu: {
                                        name: "Unknown GPU",
                                        memory: gpuMemoryMB,
                                        type: "dedicated",
                                        supportsCUDA: false,
                                    },
                                }
                            : {}),
                    },
                    type: gpuMemoryMB !== null && !isNaN(gpuMemoryMB) ? "gpu" : "nogpu",
                };

                // Store the diagnostics using the Tauri Store plugin.
                const store = await load("store.json", { autoSave: false });
                await store.set("deviceDiagnostics", deviceDiagnostics);
                await store.save();
                console.log("Diagnostics stored:", deviceDiagnostics);
            } catch (err) {
                console.error("Error running diagnostics:", err);
                setError(err instanceof Error ? err.message : "Unknown error occurred.");
            }
        }
        runDiagnostics();
    }, []);

    return (
        <div className={styles.diagnosticsContainer}>
            <h2 className={styles.heading}>System Diagnostics</h2>
            {error && <p className={styles.error}>Error: {error}</p>}
            {data ? (
                <div className={styles.info}>
                    <div className={styles.item}>
                        <h3 className={styles.itemHeading}>Memory (MB)</h3>
                        <p className={styles.itemContent}>{data.memory}</p>
                    </div>
                    <div className={styles.item}>
                        <h3 className={styles.itemHeading}>GPU Memory (MB)</h3>
                        <p className={styles.itemContent}>{data.gpu}</p>
                    </div>
                    <div className={styles.item}>
                        <h3 className={styles.itemHeading}>Free Storage (MB)</h3>
                        <p className={styles.itemContent}>{data.storage}</p>
                    </div>
                    <div className={styles.item}>
                        <h3 className={styles.itemHeading}>OS Information</h3>
                        <p className={styles.itemContent}>{data.os}</p>
                    </div>
                </div>
            ) : (
                !error && <p className={styles.loading}>Loading diagnostics...</p>
            )}
        </div>
    );
};

export default Diagnostics;
