import { MdOutlineVideocam } from 'react-icons/md'

import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <hr className={styles.divider_top}/>
        <div className={styles.footer_logo_container}>
            <MdOutlineVideocam color="#ccff00" size={25} />
            <p className={styles.footer_logo}>VidQueue</p> 
        </div>
        <p className={styles.description}>The platform for ordering YouTube videos in streamer queues.</p>
        <hr className={styles.divider_bottom}/>
        <p className={styles.copyright}>© 2026 VidQueue. All rights reserved.</p>
    </footer>
  )
}

export default Footer