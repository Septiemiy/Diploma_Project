import Button from '../ui/Button/Button';
import { useNavigate } from 'react-router-dom';

import styles from './CTA.module.scss';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <>
        <section className={styles.cta}>
            <p className={styles.title}>Ready to Get Started?</p>
            <p className={styles.description}>A simple way to connect viewers and streamers through real-time video requests</p>
            <Button
              variant="cta"
              withArrow={ true }
              onClick={() => navigate("/register")}
            >
              Start Now
            </Button>
        </section>
    </>
  )
}

export default CTA