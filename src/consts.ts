export type Site = {
  TITLE: string;
  DESCRIPTION: string;
  EMAIL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  POSTS_PER_PAGE: number;
  SITEURL: string;
};

export type Link = {
  href: string;
  label: string;
};

export const SITE: Site = {
  TITLE: "WHA",
  DESCRIPTION: "Ayaya Website",
  EMAIL: "kazenosakura100@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 4,
  POSTS_PER_PAGE: 5,
  SITEURL: "http://192.168.88.50:1234/",
};

export const NAV_LINKS: Link[] = [
  { href: "/blog", label: "blog" },
  { href: "/about", label: "about" },
  { href: "/tags", label: "tags" },
  { href: "/webring", label: "webring" },
];

export const SOCIAL_LINKS: Link[] = [
  { href: "https://github.com/WhiteSnow00", label: "GitHub" },
  { href: "https://www.facebook.com/F.Ena.2001/", label: "Facebook" },
  { href: "kazenosakura100@gmail.com", label: "Email" },
  { href: "/rss.xml", label: "RSS" },
];
