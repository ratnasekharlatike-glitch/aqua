import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import bgHero from "@/assets/bg-hero-dark.jpg";
import { useBlogStore } from "@/stores/blogStore";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import SEO from "@/components/SEO";

export default function BlogPost() {
  const { slug } = useParams();
  const posts = useBlogStore((s) => s.posts);
  const settings = useSiteSettingsStore((s) => s.settings);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Layout>
        <SEO title="Article Not Found" description="The requested WaterFilterStore article could not be found." noIndex />
        <section className="relative text-primary-foreground py-10 md:py-14 overflow-hidden">
          <img src={settings.heroImages.blog || bgHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="container text-center relative z-10">
            <h1 className="font-heading font-bold text-2xl md:text-4xl">Post Not Found</h1>
          </div>
        </section>
        <section className="py-14">
          <div className="container text-center">
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button variant="outline" className="rounded-full font-heading font-semibold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const relatedPosts = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.title}, ${post.category}, water purifier guide, water quality Visakhapatnam, WaterFilterStore`}
        type="article"
        image={post.image}
        publishedTime={post.date}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          image: post.image.startsWith("http") ? post.image : `https://waterfilterstore.in${post.image}`,
          author: { "@type": "Organization", name: "WaterFilterStore" },
          publisher: { "@type": "Organization", name: "WaterFilterStore", url: "https://waterfilterstore.in" },
          mainEntityOfPage: `https://waterfilterstore.in/blog/${post.slug}`,
        }}
      />
      <section className="relative text-primary-foreground py-10 md:py-14 overflow-hidden">
        <img src={settings.heroImages.blog || bgHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container relative z-10">
          <nav className="text-sm mb-4 opacity-60 font-medium">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:opacity-100 transition-opacity">Blog</Link>
            <span className="mx-2">/</span>
            <span className="truncate">{post.title}</span>
          </nav>
          <div className="max-w-3xl">
            <span className="bg-accent/20 text-accent font-heading font-semibold text-xs px-3 py-1 rounded-full">{post.category}</span>
            <h1 className="font-heading font-bold text-2xl md:text-4xl mt-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-sm opacity-70">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime} read</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 rounded-2xl overflow-hidden border bg-secondary">
              <img src={post.image} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
            </div>
            <div className="prose prose-sm md:prose-base max-w-none">
              {post.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return <h3 key={i} className="font-heading font-bold text-lg text-foreground mt-8 mb-3">{paragraph.replace(/\*\*/g, "")}</h3>;
                }
                if (paragraph.includes("**")) {
                  const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {parts.map((part, j) =>
                        part.startsWith("**") && part.endsWith("**")
                          ? <strong key={j} className="font-heading font-semibold text-foreground">{part.replace(/\*\*/g, "")}</strong>
                          : part
                      )}
                    </p>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ul key={i} className="list-disc list-inside space-y-1.5 mb-4 text-muted-foreground text-sm">
                      {items.map((item, j) => <li key={j}>{item.replace("- ", "")}</li>)}
                    </ul>
                  );
                }
                return <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm">{paragraph}</p>;
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-border">
              <Link to="/blog">
                <Button variant="outline" className="rounded-full font-heading font-semibold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 max-w-5xl mx-auto">
              <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-6 text-center">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((rp) => (
                  <Link to={`/blog/${rp.slug}`} key={rp.id} className="group">
                    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/20 hover:shadow-card transition-all duration-300">
                      <div className="aspect-video bg-secondary">
                        <img src={rp.image} alt={rp.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-accent font-heading font-semibold">{rp.category}</span>
                        <h3 className="font-heading font-semibold text-sm text-foreground mt-1 line-clamp-2 group-hover:text-accent transition-colors">{rp.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
