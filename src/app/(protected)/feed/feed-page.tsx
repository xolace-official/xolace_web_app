import { PageContainer } from "@/components/app/page-container";
import PostCard from "@/components/cards/post-card";

export const FeedPage = () => {
  const posts = [
    {
      title: "they can't keep getting away with this",
      createdAtLabel: "2 days ago",
      community: {
        name: "r/OnePunchMan",
        href: "/",
        iconSrc: "/assets/demo-community-1.svg",
      },
      media: [
        { src: "/assets/demo-post-1.svg", alt: "Demo post media 1" },
        { src: "/assets/demo-post-2.svg", alt: "Demo post media 2" },
      ],
      metrics: { score: 2800, comments: 223 },
    },
    {
      title: "Minimal cards are underrated for high-signal feeds",
      createdAtLabel: "5 hours ago",
      community: {
        name: "r/designsystems",
        href: "/",
        iconSrc: "/assets/demo-community-2.svg",
      },
      media: [{ src: "/assets/demo-post-3.svg", alt: "Demo post media 3" }],
      metrics: { score: 630, comments: 46 },
    },
  ] as const;

  return (
    <PageContainer
      title="Fireside 🔥"
      contentClassName="max-sm:px-2"
      externalContent={
        <div className="space-y-4">
          <div className="bg-card border p-4 rounded-xl shadow-xs">
            <h3 className="font-semibold mb-2">Trending</h3>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded w-3/4" />
              <div className="h-2 bg-muted rounded w-1/2" />
            </div>
          </div>
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3">
        {posts.map((post) => (
          <PostCard
            key={`${post.community.name}:${post.title}`}
            title={post.title}
            createdAtLabel={post.createdAtLabel}
            community={post.community}
            media={[...post.media]}
            metrics={post.metrics}
          />
        ))}
      </div>
    </PageContainer>
  );
};
