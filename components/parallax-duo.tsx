"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * İki görselin scroll'da zıt yönlerde kaydığı editoryal paralaks ikilisi.
 * Büyük görsel yavaş aşağı, küçük bindirmeli görsel yukarı süzülür.
 */
export function ParallaxDuo({
  srcA,
  srcB,
  altA,
  altB,
  className,
}: {
  srcA: string;
  srcB: string;
  altA: string;
  altB: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <div ref={ref} className={cn("relative pb-14", className)}>
      <motion.div
        style={reduce ? undefined : { y: yA }}
        className="relative aspect-[16/10] w-[78%] overflow-hidden rounded-3xl shadow-lift"
      >
        <Image
          src={srcA}
          alt={altA}
          fill
          sizes="(max-width: 1024px) 80vw, 760px"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        style={reduce ? undefined : { y: yB }}
        className="absolute -bottom-2 right-0 aspect-square w-[38%] overflow-hidden rounded-2xl border-[6px] border-paper shadow-lift"
      >
        <Image
          src={srcB}
          alt={altB}
          fill
          sizes="(max-width: 1024px) 40vw, 380px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
