import BenefitCard from '../ui/BenefitCardContainer/BenefitCard';
import { MdAttachMoney, MdSpeed, MdGroups, MdLink, MdDashboard, MdTune } from 'react-icons/md'

import styles from './Benefits.module.scss';

const Benefits = () => {
  return (
    <section className={styles.benefits}>
        <p className={styles.title}>BENEFITS</p>
        <p className={styles.description}>Why VidQueue?</p>
        <div className={styles.benefits_container}>
            <BenefitCard 
                Icon={MdAttachMoney}
                color='#ccff00'
                size={25}
                title='Monetize Every Request'
                description='Turn every viewer request into real income — no wasted engagement.'
            />
            <BenefitCard 
                Icon={MdSpeed}
                color='#ccff00'
                size={25}
                title='Real-Time Queue Control'
                description='Manage your video queue live during streams without interruptions.'
            />
            <BenefitCard 
                Icon={MdGroups}
                color='#ccff00'
                size={25}
                title='Audience-Driven Content'
                description='Let your viewers decide what plays next and boost engagement naturally.'
            />
            <BenefitCard 
                Icon={MdLink}
                color='#ccff00'
                size={25}
                title='Simple Sharing'
                description='Share one link and start receiving video requests instantly.'
            />
            <BenefitCard 
                Icon={MdDashboard}
                color='#ccff00'
                size={25}
                title='Smart Dashboard'
                description='Track requests, earnings, and queue activity in one place.'
            />
            <BenefitCard 
                Icon={MdTune }
                color='#ccff00'
                size={25}
                title='Flexible Pricing System'
                description='Set your own price per minute and control priority tiers.'
            />
        </div>
    </section>
  )
}

export default Benefits