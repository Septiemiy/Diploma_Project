import LoginForm from "../../components/Auth/LoginForm";

import styles from "./Login.module.scss"

const LoginPage = () => {
    return (
        <main className={styles.page}>
            <div className={styles.page_card}>
                <LoginForm />
            </div>
        </main>
    );
};

export default LoginPage;