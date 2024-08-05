import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "WHA",
  DESCRIPTION: "Ayaya Website",
  EMAIL: "kazenosakura100@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "A homepage, I guess.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Articles, posts, whatever you call it.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Projects, under construction.",
};

export const SOCIALS: Socials = [
  {
    NAME: "Facebook",
    HREF: "https://www.facebook.com/F.Ena.2001/",
  },
  {
    NAME: "Twitter",
    HREF: "https://x.com/MMizakawa",
  },
  {
    NAME: "Telegram",
    HREF: "https://t.me/ReliefShinAi",
  },
  {
    NAME: "Email",
    HREF: `mailto:${SITE.EMAIL}`,
  },
];
