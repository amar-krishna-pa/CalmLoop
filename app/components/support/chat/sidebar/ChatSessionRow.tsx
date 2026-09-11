"use client";

import { motion,useIsPresent } from "motion/react";
import type { ReactNode } from "react";

type Props={ children: ReactNode };

export default function ChatSessionRow({ children }: Props) {
  const isPresent=useIsPresent();

  return (
    <motion.li
      inert={!isPresent}
      initial={false}
      animate={{ opacity: 1,height: "auto" }}
      exit={{ opacity: 0,height: 0 }}
      className="overflow-hidden"
    >
      <div className="px-1 pt-1 pb-1.5">{children}</div>
    </motion.li>
  );
}
