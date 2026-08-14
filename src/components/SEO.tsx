import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  keywords?: string;
  structuredData?: Record<string, unknown>;
  image?: string;
  noIndex?: boolean;
  publishedTime?: string;
}

export default function SEO({ title, description, name = "WaterFilterStore", type = "website", keywords, structuredData, image = "/images/home-hero-industrial-1920.webp", noIndex = false, publishedTime }: SEOProps) {
  const canonicalUrl = `https://waterfilterstore.in${window.location.pathname === "/" ? "" : window.location.pathname}`;
  const socialImage = image.startsWith("http") ? image : `https://waterfilterstore.in${image}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | {name}</title>
      <meta name='description' content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="geo.region" content="IN-AP" />
      <meta name="geo.placename" content="Visakhapatnam" />
      <meta name="geo.position" content="17.6868;83.2185" />
      <meta name="ICBM" content="17.6868, 83.2185" />
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={`${title} | ${name}`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:alt" content={title} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${name}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}
