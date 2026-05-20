import { MdOutlineVideocam } from 'react-icons/md'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import ModeToggle from '../ui/ModeToogle/ModeToggle';
import { useAuth } from '../../context/AuthContext';

import styles from './Header.module.scss'

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth()

    const isDashboard = location.pathname.startsWith('/dashboard');

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className={styles.header}>
            <Link to="/" className={styles.header_logo_container}>
                <MdOutlineVideocam color="#ccff00" size={25} />
                <p className={styles.header_logo}>VidQueue</p>
            </Link>
            {isDashboard && isAuthenticated ? (
                <>
                    <ModeToggle />
                    <div className={styles.header_user}>
                        <div className={styles.header_avatar}>
                            {user?.username.slice(0, 2).toUpperCase()}
                        </div>
                        <button
                            className={styles.header_logout}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </>
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
        </div>
    )
}

export default Header;