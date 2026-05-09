import { Outlet } from "react-router-dom";
import FiltersSidebar from "../FiltersSidebar/FiltersSidebar";
import SubscriptionsSidebar from "../SubscriptionsSidebar/SubscriptionsSidebar";
import Header from "../Header/Header";

import styles from "./DashboardLayout.module.scss";

const DashboardLayout = () => {
    return (
        <>
            <Header />
            <div className={styles.layout}>
                <aside className={styles.layout_left}>
                    <FiltersSidebar />
                </aside>
                <main className={styles.layout_main}>
                    <Outlet />
                </main>
                <aside className={styles.layout_right}>
                    <SubscriptionsSidebar />
                </aside>
            </div>
        </>
    );
};

export default DashboardLayout;