import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Matt E. Jones",
  EMAIL: "me@mej.xyz",
  NUM_POSTS_ON_HOMEPAGE: 4,
  NUM_WORKS_ON_HOMEPAGE: 0,
  NUM_PROJECTS_ON_HOMEPAGE: 4,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Matt E. Jones — The Joyful Technologist.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of thoughts, ideas and technical articles.",
};

export const WORK: Metadata = {
  TITLE: "CV",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Things I have built.",
};

export const CONTACT: Metadata = {
  TITLE: "Contact",
  DESCRIPTION: "Get in touch.",
};

export const SOCIALS: Socials = [
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/j0n35",
  },
];

export const SKILLS: string[] = [
  "TypeScript",
  "Python",
  "Go",
  "React",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Linux",
  "Homelab",
  "Salesforce",
  "HubSpot",
  "Claude"
];
