import { createContext, useContext, useState } from "react";

import type { DashboardMode, IQueue } from "../interfaces/interfaces";

interface DashboardContextValue {
    mode: DashboardMode;
    setMode: (mode: DashboardMode) => void;
    activeQueueIds: number[];
    toggleQueue: (id: number) => void;
    clearQueues: () => void;
    allQueues: IQueue[];
    setAllQueues: (queues: IQueue[]) => void;
    activeStreamerId: string | null;
    setActiveStreamerId: (id: string | null) => void;
    isOrderModalOpen: boolean;
    openOrderModal: () => void;
    closeOrderModal: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<DashboardMode>("viewer");
    const [activeQueueIds, setActiveQueueIds] = useState<number[]>([]);
    const [allQueues, setAllQueues] = useState<IQueue[]>([]);
    const [activeStreamerId, setActiveStreamerId] = useState<string | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const toggleQueue = (id: number) => {
        setActiveQueueIds((prev) =>
            prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
        );
    };

    const clearQueues = () => setActiveQueueIds([]);
    const openOrderModal = () => setIsOrderModalOpen(true);
    const closeOrderModal = () => setIsOrderModalOpen(false);

    return (
        <DashboardContext.Provider
            value={{
                mode, setMode,
                activeQueueIds, toggleQueue, clearQueues,
                allQueues, setAllQueues,
                activeStreamerId, setActiveStreamerId,
                isOrderModalOpen, openOrderModal, closeOrderModal,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
    return ctx;
};