import Container from "@/components/container";
import { ImageComponent } from "@/components/image";
import { TextScroll } from "@/components/ui/text-scroll";
import { Button } from "@/components/ui/button";
import { GoogleForms } from "@/components/logos/google-forms";
import { Mail } from "lucide-react";
import { Metadata } from "next";
import ContactImage from "@/assets/img/profpic.jpg";
import type { WebPage, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
  openGraph: {
    title: "Contact",
    description: "Get in touch.",
  },
};

const GOOGLE_FORMS_URL = "https://forms.gle/gGdDTz5BGpjeudvx6";

export default function ContactPage() {
  const jsonLd: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Contact",
    alternateName: "WHA | Contact",
    mainEntityOfPage: "https://irvanma.eu.org/contact",
    description: "Get in touch.",
    url: "https://irvanma.eu.org/contact",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Landing",
          item: "https://irvanma.eu.org/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: "https://irvanma.eu.org/contact",
        },
      ],
    },
  };

  return (
    <>
      <Container>
        <div className="relative rounded-lg overflow-clip">
          <ImageComponent
            img={ContactImage}
            alt="Contact"
            className="w-full relative max-h-96 z-10 rounded-lg"
            height={720}
          />
          <p className="z-20 md:w-fit w-3/4 text-center font-bold absolute bottom-3 left-1/2 rounded-full -translate-x-1/2 px-7 py-3 font-doto bg-background/80 text-foreground md:text-xl backdrop-blur-lg">
            CONTACT
          </p>
        </div>

        <div className="w-full bg-background rounded-lg border border-border">
          <h2 className="w-full flex items-center gap-3 text-muted-foreground px-5 py-3 border-b border-border">
            <Mail className="size-4" />
            <span className="text-sm font-mono">CONTACT.md</span>
          </h2>
          <div className="p-5 flex flex-col gap-3">
            <p>
              Ai có câu hỏi thì thì gửi form dưới đây
            </p>
            <p className="text-sm text-muted-foreground">
              (Dù khá hiếm khi check gmail nhưng có còn hơn không)
            </p>
            <Button variant="secondary" asChild className="w-full">
              <a
                href={GOOGLE_FORMS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="flex items-center gap-2">
                  <GoogleForms className="size-4" />
                  Fill out the form here
                  <span className="sr-only">Contact form for WHA</span>
                </span>
              </a>
            </Button>
          </div>
        </div>
      </Container>

      <TextScroll
        className="text-5xl md:text-7xl text-muted-foreground/50 dark:font-semibold font-bold py-24 md:space-y-2"
        textClassName="py-1 md:py-3 font-doto"
        default_velocity={0.66}
        text="Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu.  "
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
