import { Helmet } from "react-helmet-async";

type Props = {
  title?: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
  image?: string;
};

export const Seo = ({ title, description, canonical, jsonLd, image }: Props) => {
  const fullTitle = title
    ? `${title} | Kentainers`
    : "Kentainers — Industrial Water Tanks, Septic Tanks & Agricultural Solutions";
  const desc =
    description ??
    "Kentainers is Kenya's trusted manufacturer of water tanks, septic tanks, agricultural sprayers and silage solutions. Shop or request a bulk quote.";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
