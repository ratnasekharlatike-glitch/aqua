import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import bgHero from "@/assets/bg-hero-dark.jpg";
import { useBlogStore } from "@/stores/blogStore";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import SEO from "@/components/SEO";

export default function Blog() {
  const posts = useBlogStore((s) => s.posts);
  const settings = useSiteSettingsStore((s) => s.settings);
  return (
    <Layout>
      <SEO title="Water Purifier Guides & Water Quality Tips" description="Read expert guides on choosing RO, UV and UF purifiers, understanding TDS, maintaining water filters and improving drinking water quality in Visakhapatnam." keywords="water purifier guide, RO vs UV vs UF, TDS water guide, water purifier maintenance, drinking water tips, WaterFilterStore blog" />
      <section className="relative text-primary-foreground py-10 md:py-14 overflow-hidden">
        <img src={settings.heroImages.blog || bgHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container text-center relative z-10">
          <nav className="text-sm mb-4 opacity-60 font-medium">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span className="mx-2">/</span>
            <span>Blog</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl md:text-4xl">Knowledge Hub</h1>
          <p className="mt-3 opacity-70 text-sm md:text-base max-w-xl mx-auto">Learn about water purification, health tips, and product guides</p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id}>
                <article className="bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/20 hover:shadow-card-hover transition-all duration-300 group h-full flex flex-col">
                  <div className="aspect-video bg-secondary relative overflow-hidden">
                    <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-navy/5 group-hover:bg-navy/10 transition-colors" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="bg-accent/10 text-accent font-heading font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                    </div>
                    <h2 className="font-heading font-bold text-base text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-sm font-heading font-semibold text-accent group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
