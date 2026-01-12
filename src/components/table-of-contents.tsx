"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const intersectingIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3"));
    const mapped: Heading[] = elements
      .filter((elem) => Boolean(elem.id))
      .map((elem) => ({
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.substring(1)),
      }));
    setHeadings(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = intersectingIdsRef.current;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        });

        const nextActive =
          mapped.map((h) => h.id).filter((id) => intersecting.has(id)).at(-1) ??
          null;
        if (nextActive) setActiveId(nextActive);
      },
      { rootMargin: "0px 0px -40% 0px" },
    );

    elements.filter((elem) => Boolean(elem.id)).forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="w-64 flex flex-col gap-2">
      <p className="font-semibold mb-2 text-sm text-foreground/80">
        Trong trang này
      </p>
      <div className="flex flex-col text-sm border-r border-border/50">
        {headings.map((heading) => (
          <motion.a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "relative pr-4 py-1.5 transition-colors hover:text-foreground",
              heading.id === activeId
                ? "text-foreground font-medium"
                : "text-muted-foreground",
            )}
            style={{
              paddingLeft: heading.level === 3 ? "2rem" : "1rem",
            }}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById(heading.id);
              if (!target) return;
              setActiveId(heading.id);
              target.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {heading.id === activeId && (
              <motion.div
                layoutId="toc-indicator"
                className="absolute right-0 top-0 bottom-0 w-0.5 bg-foreground rounded-l-full"
                transition={{ type: "spring", stiffness: 520, damping: 45 }}
              />
            )}
            {heading.text}
          </motion.a>
        ))}
      </div>
    </nav>
  );
}
