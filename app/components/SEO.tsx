import { Helmet } from "react-helmet";

export default function SEO({
    title,
    description,
    keywords,
    url
}: {
    title: string;
    description: string;
    keywords: string;
    url: string;
}) {
    return (
        <Helmet>
            {/* ✅ Basic SEO */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* ✅ OpenGraph for Social Sharing */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />

            {/* ✅ Twitter Preview */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {/* ✅ JSON-LD Schema for Google Ranking */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "ResuAIze - AI Resume Analyzer",
                    url: url,
                    description: description
                })}
            </script>
        </Helmet>
    );
}
