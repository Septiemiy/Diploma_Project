import { GoArrowRight } from 'react-icons/go';

import styles from './CTA.module.scss';

const CTA = () => {
  return (
    <>
        <section className={styles.cta}>
            <p className={styles.title}>Ready to Get Started?</p>
            <p className={styles.description}>A simple way to connect viewers and streamers through real-time video requests</p>
            <button className={styles.cta_button}>Start Now <span><GoArrowRight size={20} /></span></button>
        </section>
    </>
  )
}

export default CTA