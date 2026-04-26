import { GoArrowRight } from "react-icons/go";

import styles  from './Hero.module.scss'

interface Props {
  onHowItWorksClick: () => void;
}

const Hero = ({ onHowItWorksClick }: Props) => {

  return (
    <section className={styles.hero}>
        <div className={styles.hero_content}>
            <div className={styles.hero_eyebrow}>REAL-TIME STREAMER VIDEO QUEUE POWERED BY VIEWER REQUESTS</div>
            <div className={styles.hero_title}>
              <div>ORDER A VIDEO.</div>
              <div>PAY PER MINUTE.</div>
              <div className={styles.hero_title_highlight}>GET IN THE QUEUE.</div>
              <div className={styles.hero_subtitle}>Let your viewers decide what plays next.<br />Earn from every video request.</div>
            </div>
            <div className={styles.hero_actions}>
              <button className={styles.hero_button_primary}>Order a Video <span><GoArrowRight size={20} /></span></button>
              <button 
                className={styles.hero_button_secondary} 
                onClick={onHowItWorksClick}
              >
                How It Works
              </button>
            </div>
        </div>
        
    </section>
  )
}

export default Hero