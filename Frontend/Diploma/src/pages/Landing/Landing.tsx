import Header from '../../components/Header/Header.tsx';
import Hero from '../../components/Hero/Hero.tsx';
import HowItWorks from '../../components/HowItWorks/HowItWorks.tsx';
import { useRef } from 'react';

import styles from './Landing.module.scss'

const Landing = () => {

  const howItWorksRef = useRef<HTMLButtonElement | null>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView();
  };

  return (
    <>
      <Header />
      <Hero onHowItWorksClick={scrollToHowItWorks} />
      <HowItWorks ref={howItWorksRef} />
    </>
  )
}

export default Landing