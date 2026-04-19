import { MdOutlineVideocam } from 'react-icons/md'

import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.header_logo_container}>
        <MdOutlineVideocam color="#ccff00" size={25} />
        <p className={styles.header_logo}>VidPriority</p> 
      </div>
      <div className={styles.header_actions}>
        <button className={styles.header_actions_signin}>Sign In</button>
        <button className={styles.header_actions_signup}>Get Started</button>
      </div>
    </div>
  )
}

export default Header