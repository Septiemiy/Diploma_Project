import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";
import { useEffect, useState } from "react";
import { subscriptionsApi } from "../../api/api";

import styles from "./SubscriptionsSidebar.module.scss";

interface SidebarUser {
    id: number;
    username: string;
}

const Avatar = ({ username }: {username: string}) => (
    <div className={styles.avatar}>
        {username.slice(0, 2).toUpperCase()}
    </div>
);

const SubscriptionsSidebar = () => {
    const { mode } = useDashboard();
    const navigate = useNavigate();

    const isStreamer = mode === "streamer";

    const [list, setList] = useState<SidebarUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const fetch = isStreamer ? subscriptionsApi.getMySubscribers() : subscriptionsApi.getMySubscriptions()
        fetch.then(setList)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [mode])

    return (
        <aside className={styles.sidebar}>
            {isStreamer ? (
                <button
                    className={styles.sidebar_mypage}
                    onClick={() => navigate('/dashboard/my')}
                >
                    My Streamer Page
                </button>
            ) : null}
            <div className={styles.sidebar_header}>
                <span className={styles.sidebar_title}>
                    {isStreamer ? "Subscribers" : "Subscriptions"}
                </span>
                <span className={styles.sidebar_count}>
                    {list.length}
                </span>
            </div>

            {loading ? (
                <p className={styles.sidebar_loading}>Loading...</p>
            ) : list.length === 0 ? (
                <p className={styles.sidebar_empty}>
                    {isStreamer ? 'No subscribers yet' : 'No subscriptions yet'}
                </p>
            ) : (
                <ul className={styles.sidebar_list}>
                    {isStreamer ? 
                        list.map((viewer) => (
                              <li key={viewer.id} className={styles.sidebar_item}>
                                  <Avatar username={viewer.username} />
                                  <span className={styles.sidebar_item_name}>
                                      {viewer.username}
                                  </span>
                              </li>
                            ))
                        : list.map((streamer) => (
                              <li key={streamer.id}>
                                  <button
                                      className={styles.sidebar_item}
                                      onClick={() =>
                                          navigate(`/dashboard/streamer/${streamer.id}`)
                                      }
                                  >
                                      <Avatar username={streamer.username} />
                                      <span className={styles.sidebar_item_name}>
                                          {streamer.username}
                                      </span>
                                      <span className={styles.sidebar_item_arrow}>›</span>
                                  </button>
                              </li>
                        ))}
                </ul>
            )}
        </aside>
    );
};

export default SubscriptionsSidebar;