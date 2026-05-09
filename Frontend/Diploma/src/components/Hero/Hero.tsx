import Button from '../ui/Button/Button';
import { useNavigate } from 'react-router-dom';

import styles  from './Hero.module.scss'

interface Props {
  onHowItWorksClick: () => void;
}

const Hero = ({ onHowItWorksClick }: Props) => {
  const navigate = useNavigate();

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
            <Button
              variant="primary"
              withArrow={ true }
              onClick={() => navigate("/register")}
            >
              Order a Video
            </Button>
            <Button
              variant="secondary"
              withArrow={ false }
              onClick={ onHowItWorksClick }
            >
              How It Works
            </Button>
          </div>
      </div>
    </section>
  )
}

export default Hero