"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "-40px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      className={visible ? "landing-reveal landing-reveal--visible" : "landing-reveal"}
      sx={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Box>
  );
}
