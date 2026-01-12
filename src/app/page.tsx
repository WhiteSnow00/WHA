import Container from "@/components/container";
import { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import type { WebPage, WithContext } from "schema-dts";
import HeroImage from "@/assets/img/hero.jpg";
import HeroProfile from "@/assets/img/profpic-animated.webp";
import { Book, Info, Newspaper, Server } from "lucide-react";
import { SelfHostedServices } from "@/components/selfhosted";
import { TextScroll } from "@/components/ui/text-scroll";
import { getPosts } from "@/lib/fs/posts";

export const metadata: Metadata = {
  title: "Landing | WHA",
  description: "Where it all begins.",
  openGraph: {
    title: "Landing | WHA",
    description: "Where it all begins.",
  },
};

export default function Home() {
  const featuredPosts = getPosts()
    .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
    .slice(0, 5);

  const jsonLd: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kanaria",
    alternateName: "WHA",
    mainEntityOfPage: "https://wha-ayaya.vercel.app/",
    description: "Where it all begins.",
    url: "https://wha-ayaya.vercel.app/",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Landing",
          item: "https://wha-ayaya.vercel.app/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: "https://irvanma.eu.org/about",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Blog",
          item: "https://irvanma.eu.org/blog",
        },
      ],
    },
  };

  return (
    <>
      <Container>
        <Hero img={HeroImage} profile={HeroProfile} />
        <div className="w-full bg-background rounded-lg border border-border">
          <h2 className="w-full flex items-center gap-3 text-muted-foreground px-5 py-3 border-b border-border">
            <Book className="size-4" />
            <span className="text-sm font-mono">DESCRIPTION.md</span>
          </h2>
          <p className="px-5 py-3">
              Chả biết viết cái gì ở phần này. Thôi thì type vài chữ cho có vậy.
          </p>
        </div>
        <div className="w-full bg-background rounded-lg border border-border">
          <h2 className="w-full flex items-center gap-3 text-muted-foreground px-5 py-3 border-b border-border">
            <Newspaper className="size-4" />
            <span className="text-sm font-mono">FEATURED_POSTS.md</span>
          </h2>
          <div className="p-5 flex flex-col gap-3">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="w-full rounded-md border border-border bg-secondary/20 px-4 py-3 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold line-clamp-1">{post.title}</p>
                  <p className="text-xs text-muted-foreground font-mono shrink-0">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
            <Button asChild className="w-full" variant="secondary">
              <Link href="/blog">View all posts</Link>
            </Button>
          </div>
        </div>
        <div className="w-full bg-background rounded-lg border border-border">
          <h2 className="w-full flex items-center gap-3 text-muted-foreground px-5 py-3 border-b border-border">
            <Server className="size-4" />
            <span className="text-sm font-mono">Link.md</span>
          </h2>
          <p className="px-5 py-3 border-b border-border">
            Link vào nhóm Discord và Telegram của tôi.
          </p>
          <SelfHostedServices />
        </div>
        <div className="w-full bg-background rounded-lg border border-border">
          <h2 className="w-full flex items-center gap-3 text-muted-foreground px-5 py-3 border-b border-border">
            <Info className="size-4" />
            <span className="text-sm font-mono">ABOUT_SITE.md</span>
          </h2>
          <p className="px-5 py-3">
            This site is built using{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Next.js
            </a>
            ,{" "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              TailwindCSS
            </a>
            ,{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              shadcn/ui
            </a>
            , and{" "}
            <a
              href="https://tanstack.com/query"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Tanstack Query
            </a>
            . It is hosted on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Vercel
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/WhiteSnow00/WHA"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </Container>
      <TextScroll
        className="text-5xl md:text-7xl text-muted-foreground/50 dark:font-semibold font-bold py-24 md:space-y-2"
        textClassName="py-1 md:py-3 font-doto"
        default_velocity={0.66}
        text="Shuumatsu Nani Shitemasu ka? Isogashii Desu ka? Sukutte Moratte Ii Desu ka?"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
