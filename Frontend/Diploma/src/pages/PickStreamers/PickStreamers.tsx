import { MdOutlineVideocam } from "react-icons/md";

import styles from "./PickStreamers.module.scss";


const PickStreamerPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.page_placeholder}>
                <MdOutlineVideocam size={40} className={styles.page_placeholder_icon} />
                <p className={styles.page_placeholder_text}>
                    Find a streamer to view their queue
                </p>
                <p className={styles.page_placeholder_hint}>
                    Search by username above or pick one from your subscriptions
                </p>
            </div>
        </div>
    );
};

export default PickStreamerPage;