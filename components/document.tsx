import type { ReactNode } from "react";

type DocumentProps = {
  title: string;
  description: string;
  canonical: string;
  children: ReactNode;
  image?: string;
};

export function Document({ title, description, canonical, image = "/yassa-immutable-laws.png", children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/styles.css" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`https://blog.kurult.ai${image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#18201c" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
