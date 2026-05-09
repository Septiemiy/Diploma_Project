import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";

import styles from "./RegistrationForm.module.scss";

interface FormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.username.trim()) {
        errors.username = "Username is required";
    } else if (values.username.trim().length < 3) {
        errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
        errors.username = "Only letters, numbers and underscores allowed";
    }

    if (!values.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Enter a valid email address";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(values.password)) {
        errors.password = "Password must contain at least one number";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

const RegistrationForm = () => {
    const [values, setValues] = useState<FormValues>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...values, [name]: value };
        setValues(updated);

        if (touched[name]) {
            setErrors(validate(updated));
        }

        // Реvalіdate confirmPassword якщо змінюється password
        if (name === "password" && touched["confirmPassword"]) {
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
        const allTouched = {
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        };
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
                <span className={styles.form_eyebrow}>Get started</span>
                <h1 className={styles.form_title}>Create your account</h1>
                <p className={styles.form_subtitle}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.form_link}>
                        Sign in
                    </Link>
                </p>
            </div>

            <div className={styles.form_fields}>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="your_username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.username}
                />
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
                <div className={styles.form_passwordGroup}>
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
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                />
            </div>

            <Button variant="primary" withArrow onClick={handleSubmit}>
                Create Account
            </Button>
        </div>
    );
};

export default RegistrationForm;