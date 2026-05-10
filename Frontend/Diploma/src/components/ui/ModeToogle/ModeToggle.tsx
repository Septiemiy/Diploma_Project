import { useDashboard } from "../../../context/DashboardContext";
import { useNavigate } from "react-router-dom";

import styles from "./ModeToggle.module.scss";

const ModeToggle = () => {
    const { mode, setMode } = useDashboard();
    const navigate = useNavigate();

    const handleSwitch = (newMode: 'viewer' | 'streamer') => {
        if (newMode === mode) {
            return
        }

        setMode(newMode)
        navigate('/dashboard')
    }

    return (
        <div className={styles.toggle}>
            <button
                className={`${styles.toggle_btn} ${mode === "viewer" ? styles.toggle_btn__active : ""}`}
                onClick={() => handleSwitch("viewer")}
            >
                I'm a Viewer
            </button>
            <button
                className={`${styles.toggle_btn} ${mode === "streamer" ? styles.toggle_btn__active : ""}`}
                onClick={() => handleSwitch("streamer")}
            >
                I'm a Streamer
            </button>
        </div>
    );
};

export default ModeToggle;