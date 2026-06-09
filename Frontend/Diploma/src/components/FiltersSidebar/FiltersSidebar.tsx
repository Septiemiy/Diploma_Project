import { useDashboard } from "../../context/DashboardContext";

import styles from "./FiltersSidebar.module.scss";

const FiltersSidebar = () => {
    const { allQueues, activeQueueIds, toggleQueue, clearQueues } = useDashboard();

    if (allQueues.length === 0) {
        return (
            <aside className={styles.sidebar}>
                <p className={styles.sidebar_empty}>Select a streamer to see queues</p>
            </aside>
        );
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebar_header}>
                <span className={styles.sidebar_title}>Queues</span>
                {activeQueueIds.length > 0 ? (
                    <button className={styles.sidebar_clear} onClick={clearQueues}>
                        Clear
                    </button>
                ): null}
            </div>

            <ul className={styles.sidebar_list}>
                {allQueues.map((queue) => {
                    const isActive = activeQueueIds.includes(queue.id);
                    return (
                        <li key={queue.id}>
                            <button
                                className={`${styles.sidebar_item} ${isActive ? styles.sidebar_item__active : ""}`}
                                onClick={() => toggleQueue(queue.id)}
                            >
                                <span className={styles.sidebar_item_label}>{queue.label}</span>
                                <span className={styles.sidebar_item_price}>
                                    ${queue.price_per_minute}
                                    <span className={styles.sidebar_item_unit}>/min</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className={styles.sidebar_hint}>
                {activeQueueIds.length === 0 ? 
                    "All queues shown"
                    : `${activeQueueIds.length} queue${activeQueueIds.length > 1 ? "s" : ""} selected`}
            </div>
        </aside>
    );
};

export default FiltersSidebar;