import { MdOutlineVideocam } from 'react-icons/md'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import ModeToggle from '../ui/ModeToogle/ModeToggle';

import styles from './Header.module.scss'

const Avatar = () => (
    <div className={styles.header_avatar}>
        ME
    </div>
);

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <div className={styles.header}>
            <Link to="/" className={styles.header_logo_container}>
                <MdOutlineVideocam color="#ccff00" size={25} />
                <p className={styles.header_logo}>VidQueue</p>
            </Link>
            {isDashboard ? (
                <ModeToggle /> 
            ) : (
                <div className={styles.header_actions}>
                    <button
                        onClick={() => navigate('/login')}
                        className={styles.header_actions_signin}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className={styles.header_actions_signup}
                    >
                        Get Started
                    </button>
                </div>
            )}
            {isDashboard ? <Avatar /> : null}
        </div>
    );
};

export default Header;