import type { InputHTMLAttributes } from "react";

import styles from "./Input.module.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = ({ label, error, id, ...props }: Props) => {
    return (
        <div className={styles.wrapper}>
            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`${styles.input} ${error ? styles.input__error : ""}`}
                {...props}
            />
            {error && <span className={styles.errorMsg}>{error}</span>}
        </div>
    );
};

export default Input;