import { getEntry } from "astro:content";

export async function parseAuthors(authors: string[]) {
  if (!authors || authors.length === 0) return [];

  const parseAuthor = async (slug: string) => {
    try {
      slug = slug.toLowerCase();
      const author = await getEntry("webring", slug);
      if (!author || author === undefined) {
        throw new Error(`Fetched author entry is undefined for slug: ${slug}`);
      }
      return {
        slug,
        name: author.data.name || slug,
        avatar: author.data.avatar || "/static/logo.png",
        isRegistered: !!author,
      };
    } catch (error) {
      // Suppress console.error to reduce noise
      return {
        slug,
        name: slug,
        avatar: "/static/logo.png",
        isRegistered: false,
      };
    }
  };

  return await Promise.all(authors.map(parseAuthor));
}