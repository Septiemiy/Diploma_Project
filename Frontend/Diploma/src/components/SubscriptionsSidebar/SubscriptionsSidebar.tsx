import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";

import type { IStreamer, IViewer } from "../../interfaces/interfaces";

import styles from "./SubscriptionsSidebar.module.scss";

// Mock data
const MOCK_SUBSCRIPTIONS: IStreamer[] = [
    { id: 1, username: "xQc", queues: [], orders: [] },
    { id: 2, username: "Asmongold", queues: [], orders: [] },
    { id: 3, username: "ubermarginal", queues: [], orders: [] },
    { id: 4, username: "Jeens", queues: [], orders: [] },
];

const MOCK_SUBSCRIBERS: IViewer[] = [
    { id: 10, username: "viewer_one" },
    { id: 11, username: "gamer_xyz" },
    { id: 12, username: "nightwatcher" },
];

interface AvatarProps {
    username: string;
}

const Avatar = ({ username }: AvatarProps) => (
    <div className={styles.avatar}>
        {username.slice(0, 2).toUpperCase()}
    </div>
);

const SubscriptionsSidebar = () => {
    const { mode } = useDashboard();
    const navigate = useNavigate();

    const isStreamer = mode === "streamer";

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebar_header}>
                <span className={styles.sidebar_title}>
                    {isStreamer ? "Subscribers" : "Subscriptions"}
                </span>
                <span className={styles.sidebar_count}>
                    {isStreamer ? MOCK_SUBSCRIBERS.length : MOCK_SUBSCRIPTIONS.length}
                </span>
            </div>

            <ul className={styles.sidebar_list}>
                {isStreamer
                    ? MOCK_SUBSCRIBERS.map((viewer) => (
                          <li key={viewer.id} className={styles.sidebar_item}>
                              <Avatar username={viewer.username} />
                              <span className={styles.sidebar_item_name}>{viewer.username}</span>
                          </li>
                      ))
                    : MOCK_SUBSCRIPTIONS.map((streamer) => (
                          <li key={streamer.id}>
                              <button
                                  className={styles.sidebar_item}
                                  onClick={() => navigate(`/dashboard/streamer/${streamer.id}`)}
                              >
                                  <Avatar username={streamer.username} />
                                  <span className={styles.sidebar_item_name}>{streamer.username}</span>
                                  <span className={styles.sidebar_item_arrow}>›</span>
                              </button>
                          </li>
                        )
                    )
                }
            </ul>
        </aside>
    );
};

export default SubscriptionsSidebar;