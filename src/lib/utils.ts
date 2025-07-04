/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractRelevantResumeSections(resume: string): string {
  const lines = resume.split(/\n|(?<=\. )/);
  const keepSections = ["experience", "project", "skill", "education"];

  return lines
    .filter((line) => {
      const l = line.toLowerCase();
      return (
        keepSections.some((section) => l.includes(section)) || l.length > 30
      );
    })
    .slice(0, 80)
    .join("\n");
}

export function extractRelevantJDSections(jd: string): string {
  const lines = jd.split(/\n|(?<=\. )/);
  const keepSections = [
    "responsibilities",
    "requirements",
    "qualifications",
    "skills",
    "expect",
  ];

  return lines
    .filter((line) => {
      const l = line.toLowerCase();
      return (
        keepSections.some((section) => l.includes(section)) || l.length > 30
      );
    })
    .slice(0, 60)
    .join("\n");
}
