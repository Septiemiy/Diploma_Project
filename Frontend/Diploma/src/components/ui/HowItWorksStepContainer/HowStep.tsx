import type { IconType } from 'react-icons/lib';

import styles from './HowStep.module.scss';

interface Props {
    stepNumber?: string;
    Icon?: IconType;
    color?: string;
    size?: number;
    title: string;
    description: string;
}

const HowStep = ({ stepNumber, Icon, color, size, title, description }: Props) => {
  return (
    <>
        <div className={styles.step_container}>
          <div className={styles.step_number}>{stepNumber}<span>&gt;</span></div>
            <div className={styles.step_content}>
              <div className={styles.icon}>
                {Icon ? <Icon color={color} size={size}/> : null}
              </div>
              <div className={styles.title}>{title}</div>
              <div className={styles.description}>{description}</div>
            </div>
        </div>
    </>
  )
}

export default HowStep