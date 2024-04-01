import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Matt E. Jones",
  EMAIL: "me@mej.xyz",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 0,
  NUM_PROJECTS_ON_HOMEPAGE: 0,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "The personal website of Matt E. Jones. Mainly a blog",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of thoughts, ideas and technical articles.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Some projects",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/me_jones",
  },
  { 
    NAME: "stack-overflow",
    HREF: "https://stackoverflow.com/users/1265467/matt-jones"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/j0n35",
  }
];
