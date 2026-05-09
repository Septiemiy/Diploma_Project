import { GoArrowRight } from "react-icons/go";

import styles from "./Button.module.scss"
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "cta";
    withArrow?: boolean;
}

const Button = ({ children, variant="primary", withArrow=false, ...props }: Props ) => {
  return (
    <>
        <button className={styles[variant]} { ...props }>
            {children} 

            {withArrow ? (    
                <span><GoArrowRight size={20} /></span>
            ) : null}
        </button>
    </>
  )
}

export default Button