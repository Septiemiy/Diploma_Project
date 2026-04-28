import HowStep from '../ui/HowItWorksStepContainer/HowStep';
import { forwardRef } from 'react';
import { MdOutlineVideocam, MdOutlineFormatListNumbered, MdOutlineAttachMoney, 
        MdPlayArrow, MdLiveTv, MdQueue, MdLink, MdDashboardCustomize } from 'react-icons/md'


import styles from './HowItWorks.module.scss';

const HowItWorks = forwardRef<HTMLButtonElement>((_, ref) => {
  return (
    <section ref={ref} className={styles.howItWorks}>
      <p className={styles.title}>HOW IT WORKS</p>
      <p className={styles.description}>Here's how VidQueue makes your video played</p>
      <div className={styles.steps_container}>
        <HowStep 
            stepNumber='01'
            isArrowNeed={true}
            Icon={MdOutlineVideocam}
            color='#ccff00'
            size={25}
            title='Paste a YouTube Link'
            description='Drop any YouTube video URL into the order form.'
        />
        <HowStep 
            stepNumber='02'
            isArrowNeed={true}
            Icon={MdOutlineFormatListNumbered}
            color='#ccff00'
            size={25}
            title='Choose Your Queue'
            description='Pick any available queue.'
        />
        <HowStep 
            stepNumber='03'
            isArrowNeed={true}
            Icon={MdOutlineAttachMoney}
            color='#ccff00'
            size={25}
            title='Pay For Video'
            description='Pay using any convenient method.'
        />
        <HowStep 
            stepNumber='04'
            isArrowNeed={false}
            Icon={MdPlayArrow}
            color='#ccff00'
            size={25}
            title='Video Plays'
            description='Higher tier = higher priority. Your video gets played sooner.'
        />
      </div>
      <p className={styles.description}>Here's how VidQueue helps streamers manage requests and earn from them</p>
      <div className={styles.steps_container}>
        <HowStep 
            stepNumber='01'
            isArrowNeed={true}
            Icon={MdLiveTv}
            color='#ccff00'
            size={25}
            title='Enable Streamer Mode'
            description='Activate streamer mode to start managing requests.'
        />
        <HowStep 
            stepNumber='02'
            isArrowNeed={true}
            Icon={MdQueue}
            color='#ccff00'
            size={25}
            title='Set Up Your Queue'
            description='Define prices and control video priority.'
        />
        <HowStep 
            stepNumber='03'
            isArrowNeed={true}
            Icon={MdLink}
            color='#ccff00'
            size={25}
            title='Share Your Link'
            description='Send your page to viewers so they can start requesting videos.'
        />
        <HowStep 
            stepNumber='04'
            isArrowNeed={false}
            Icon={MdDashboardCustomize}
            color='#ccff00'
            size={25}
            title='Use Your Dashboard'
            description='Track requests, manage playback, and earn from every video.'
        />
      </div>
    </section>
  )
});

export default HowItWorks