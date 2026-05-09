import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";

import styles from "./LoginForm.module.scss";

interface FormValues {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Enter a valid email address";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};

const LoginForm = () => {
    const [values, setValues] = useState<FormValues>({ email: "", password: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...values, [name]: value };
        setValues(updated);

        if (touched[name]) {
            setErrors(validate(updated));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors(validate(values));
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const allTouched = { email: true, password: true };
        setTouched(allTouched);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // TODO: підключити API
            console.log("Submit:", values);
        }
    };

    return (
        <div className={styles.form}>
            <div className={styles.form_header}>
                <span className={styles.form_eyebrow}>Welcome back</span>
                <h1 className={styles.form_title}>Sign in to your account</h1>
                <p className={styles.form_subtitle}>
                    Don't have an account?{" "}
                    <Link to="/register" className={styles.form_link}>
                        Sign up
                    </Link>
                </p>
            </div>

            <div className={styles.form_fields}>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                />
            </div>

            <Button 
                variant="primary" 
                withArrow={ true } 
                onClick={ handleSubmit }
            >
                Sign In
            </Button>
        </div>
    );
};

export default LoginForm;