import { Clock, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { HealthArticleInterface } from "@/features/health-space/health-tips/index";

/**
 * Render a full health-tip article layout including metadata, author, content, and tags.
 *
 * Renders the article's category, estimated read time, optional published date, author avatar and name (defaults to "Anonymous" when missing), optional excerpt, main content, and optional tag badges.
 *
 * @param article - Health article data containing fields used for rendering:
 *   - category.display_name: displayed above the content
 *   - read_time_minutes: shown as "{n} min"
 *   - published_at (optional): when present, shown as a localized short date
 *   - author.avatar_url and author.username: avatar image (falls back to a user icon) and author name
 *   - excerpt (optional): short summary rendered before the main content
 *   - content: main article body (preserves whitespace)
 *   - tags: array of tag objects with `name` rendered as badges when non-empty
 * @returns The component's rendered UI for the provided health article.
 */
export function HealthTipFullArticle({
  article,
}: {
  article: HealthArticleInterface;
}) {
  return (
    <article className="mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-4 text-sm text-muted-foreground">
        <span>{article.category.display_name}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {article.read_time_minutes} min
        </span>
        {article.published_at && (
          <>
            <span>•</span>
            <span>
              {new Date(article.published_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={article.author.avatar_url || undefined} />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium capitalize">
            {article.author.username || "Anonymous"}
          </p>
          <p className="text-sm text-muted-foreground">Author</p>
        </div>
      </div>

      <Separator />
      <div className="flex flex-col gap-4 prose prose-lg dark:prose-invert max-w-none">
        {article.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <div className="whitespace-pre-wrap leading-relaxed">
          {article.content}
        </div>
      </div>

      <Separator />

      {article.tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag.name} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}