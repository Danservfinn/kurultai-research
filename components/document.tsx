import type { ReactNode } from "react";

type StructuredData = Record<string, unknown>;

type DocumentProps = {
  title: string;
  description: string;
  canonical: string;
  children: ReactNode;
  image?: string;
  pageType?: "website" | "article";
  datePublished?: string;
  articleSection?: string;
  keywords?: string[];
  alternates?: { markdown?: string; json?: string; citation?: string };
  structuredData?: StructuredData;
  robots?: string;
};

function serializeStructuredData(value: StructuredData): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function Document({
  title,
  description,
  canonical,
  image = "/yassa-immutable-laws.png",
  pageType = "website",
  datePublished,
  articleSection,
  keywords = [],
  alternates,
  structuredData,
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  children,
}: DocumentProps) {
  const absoluteImage = image.startsWith("http") ? image : `https://blog.kurult.ai${image}`;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
        <meta name="author" content="Kurultai Research" />
        <meta name="robots" content={robots} />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'none'; connect-src 'self'; base-uri 'self'; form-action 'self'" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" type="application/atom+xml" title="Kurultai Research Atom feed" href="/feed.xml" />
        <link rel="alternate" type="application/feed+json" title="Kurultai Research JSON Feed" href="/feed.json" />
        {alternates?.markdown && <link rel="alternate" type="text/markdown" title="Article in Markdown" href={alternates.markdown} />}
        {alternates?.json && <link rel="alternate" type="application/json" title="Article data" href={alternates.json} />}
        {alternates?.citation && <link rel="alternate" type="application/vnd.citationstyles.csl+json" title="Citation metadata" href={alternates.citation} />}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content={pageType} />
        <meta property="og:site_name" content="Kurultai Research" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={absoluteImage} />
        <meta property="og:image:alt" content={`${title} — Kurultai Research`} />
        {pageType === "article" && datePublished && <meta property="article:published_time" content={datePublished} />}
        {pageType === "article" && datePublished && <meta property="article:modified_time" content={datePublished} />}
        {pageType === "article" && articleSection && <meta property="article:section" content={articleSection} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={absoluteImage} />
        <meta name="twitter:image:alt" content={`${title} — Kurultai Research`} />
        <meta name="theme-color" content="#18201c" />
        {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
