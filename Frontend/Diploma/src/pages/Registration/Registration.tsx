import RegistrationForm from "../../components/Auth/RegistrationForm";

import styles from "./Registration.module.scss";

const Registration = () => {
    return (
        <main className={styles.page}>
            <div className={styles.page_card}>
                <RegistrationForm />
            </div>
        </main>
    );
};

export default Registration;