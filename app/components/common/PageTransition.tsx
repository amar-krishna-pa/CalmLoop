"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAnimate } from "motion/react";

type Props = { children: ReactNode };

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const animation = animate(scope.current, { opacity: [0, 1] });
    return () => animation.stop();
  }, [pathname, animate, scope]);

  return <div ref={scope} className="h-full">{children}</div>;
}
