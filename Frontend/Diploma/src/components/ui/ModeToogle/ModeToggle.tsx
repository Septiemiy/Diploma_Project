import { useDashboard } from "../../../context/DashboardContext";

import styles from "./ModeToggle.module.scss";

const ModeToggle = () => {
    const { mode, setMode } = useDashboard();

    return (
        <div className={styles.toggle}>
            <button
                className={`${styles.toggle_btn} ${mode === "viewer" ? styles.toggle_btn__active : ""}`}
                onClick={() => setMode("viewer")}
            >
                I'm a Viewer
            </button>
            <button
                className={`${styles.toggle_btn} ${mode === "streamer" ? styles.toggle_btn__active : ""}`}
                onClick={() => setMode("streamer")}
            >
                I'm a Streamer
            </button>
        </div>
    );
};

export default ModeToggle;