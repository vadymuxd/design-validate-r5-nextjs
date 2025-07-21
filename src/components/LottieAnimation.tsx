'use client';

import Lottie from 'lottie-react';
import React, { useRef, useEffect } from 'react';

interface LottieAnimationProps {
  animationData: object;
  className?: string;
  speed?: number;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className,
  speed = 1,
}) => {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <div className={className}>
      <Lottie 
        animationData={animationData} 
        loop={true} 
        lottieRef={lottieRef}
      />
    </div>
  );
};

export default LottieAnimation; 