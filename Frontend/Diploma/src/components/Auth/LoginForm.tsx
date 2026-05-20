import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/api";

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
    const [values, setValues] = useState<FormValues>({ email: "", password: "" })
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [serverError, setServerError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

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

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const allTouched = { email: true, password: true };
        setTouched(allTouched);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        setLoading(true)
        setServerError("")

        try {
            const data = await authApi.login(values)
            login(data.token, data.user)
            navigate('/dashboard')
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
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
                    value={ values.email }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                    error={ errors.email }
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={ values.password }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                    error={ errors.password }
                />
            </div>

            {serverError ? (
                <span className={styles.form_serverError}>{serverError}</span>
            ) : null}

            <Button 
                variant="primary" 
                withArrow={ true } 
                onClick={ handleSubmit }
                disabled={ loading }
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>
        </div>
    )
}

export default LoginForm;