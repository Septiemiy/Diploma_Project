import { MdOutlineVideocam } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.scss'

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles.header_logo_container}>
        <MdOutlineVideocam color="#ccff00" size={25} />
        <p className={styles.header_logo}>VidQueue</p> 
      </div>
      <div className={styles.header_actions}>
        <button onClick={() => navigate("/login")} className={styles.header_actions_signin}>Sign In</button>
        <button onClick={() => navigate("/register")} className={styles.header_actions_signup}>Get Started</button>
      </div>
    </div>
  )
}

export default Header