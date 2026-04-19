

import styles  from './Hero.module.scss'

const Hero = () => {
  return (
    <section className={styles.hero}>
        <div className={styles.hero_content}>
            <div className={styles.hero_eyebrow}>REAL-TIME STREAMER VIDEO QUEUE POWERED BY YOUR REQUESTS</div>
            <div className={styles.hero_title}>
                <div>ORDER A VIDEO.</div>
                <div>PAY PER MINUTE.</div>
                <div className={styles.hero_title_highlight}>GET IN THE QUEUE.</div>
            </div>
        </div>
        
    </section>
  )
}

export default Hero