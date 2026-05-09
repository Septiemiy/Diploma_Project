import { createContext, useContext, useState } from "react";

import type { DashboardMode, Queue } from "../interfaces/interfaces"

interface Props {
    children: React.ReactNode;
}

interface DashboardContextValue {
    mode: DashboardMode;
    setMode: (mode: DashboardMode) => void;
    activeQueueIds: number[];
    toggleQueue: (id: number) => void;
    clearQueues: () => void;
    allQueues: Queue[];
    setAllQueues: (queues: Queue[]) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: Props) => {
    const [mode, setMode] = useState<DashboardMode>("viewer");
    const [activeQueueIds, setActiveQueueIds] = useState<number[]>([]);
    const [allQueues, setAllQueues] = useState<Queue[]>([]);

    const toggleQueue = (id: number) => {
        setActiveQueueIds((prev) =>
            prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
        );
    };

    const clearQueues = () => setActiveQueueIds([]);

    return (
        <DashboardContext.Provider
            value={{ mode, setMode, activeQueueIds, toggleQueue, clearQueues, allQueues, setAllQueues }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) { 
        throw new Error("useDashboard hook must be used inside DashboardProvider");
    }
    return ctx;
};