import HowStep from '../ui/HowItWorksStepContainer/HowStep';
import { forwardRef } from 'react';
import { MdOutlineVideocam } from 'react-icons/md'

import styles from './HowItWorks.module.scss';

const HowItWorks = forwardRef<HTMLButtonElement>((_, ref) => {
  return (
    <section ref={ref} className={styles.howItWorks}>
      <p className={styles.title}>HOW IT WORKS</p>
      <p className={styles.description}>Here's how VidQueue makes your video played</p>
      <div className={styles.steps_container}>
        <HowStep 
            stepNumber='01'
            Icon={MdOutlineVideocam}
            color='#ccff00'
            size={25}
            title='Paste a YouTube Link'
            description='Drop any YouTube video URL into the order form.'
        />
        <HowStep 
            stepNumber='02'
            Icon={MdOutlineVideocam}
            color='#ccff00'
            size={25}
            title='Paste a YouTube Link'
            description='Drop any YouTube video URL into the order form.'
        />
        <HowStep 
            stepNumber='03'
            Icon={MdOutlineVideocam}
            color='#ccff00'
            size={25}
            title='Paste a YouTube Link'
            description='Drop any YouTube video URL into the order form.'
        />
        <HowStep 
            stepNumber='04'
            Icon={MdOutlineVideocam}
            color='#ccff00'
            size={25}
            title='Paste a YouTube Link'
            description='Drop any YouTube video URL into the order form.'
        />
      </div>
    </section>
  )
});

export default HowItWorks