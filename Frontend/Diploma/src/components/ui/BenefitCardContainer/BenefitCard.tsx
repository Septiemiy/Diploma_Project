import type { IconType } from 'react-icons/lib';

import styles from './BenefitCard.module.scss';

interface Props {
    Icon?: IconType;
    color?: string;
    size?: number;
    title: string;
    description: string;
}

const BenefitCard = ({Icon, color, size, title, description}: Props) => {
  return (
    <>
        <div className={styles.benefit_content}>
            <div className={styles.icon}>
                {Icon ? <Icon color={color} size={size}/> : null}
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
        </div>
    </>
  )
}

export default BenefitCard