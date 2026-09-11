"use client";

import { motion,useIsPresent } from "motion/react";
import type { ReactNode,Ref } from "react";

type Props={
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

export default function PresenceFade({ children,className,ref }: Props) {
  const isPresent=useIsPresent();

  return (
    <motion.div
      ref={ref}
      className={className}
      inert={!isPresent}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}
