'use client';

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export function GlobalMotionLayer() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(-520);
  const pointerY = useMotionValue(-520);
  const smoothX = useSpring(pointerX, { stiffness: 52, damping: 24, mass: 0.72 });
  const smoothY = useSpring(pointerY, { stiffness: 52, damping: 24, mass: 0.72 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.28 });

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    let nextX = -520;
    let nextY = -520;

    const update = () => {
      pointerX.set(nextX - 230);
      pointerY.set(nextY - 230);
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const leave = () => {
      pointerX.set(-520);
      pointerY.set(-520);
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div className="global-motion-layer" aria-hidden="true">
      <div className="global-ambient-grid" />
      <div className="global-ambient-orb global-ambient-orb-one" />
      <div className="global-ambient-orb global-ambient-orb-two" />
      {!reduceMotion ? <motion.div className="global-pointer-glow" style={{ x: smoothX, y: smoothY }} /> : null}
      <motion.div className="global-scroll-progress" style={{ scaleX: reduceMotion ? scrollYProgress : progress }} />
    </div>
  );
}
