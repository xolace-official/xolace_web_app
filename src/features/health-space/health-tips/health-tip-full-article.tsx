import { Clock, Handshake, User } from "lucide-react";
import type { GetApiV1AuthHealthTipBySlugSlug200 } from "@/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function HealthTipFullArticle({
  article,
}: {
  article: GetApiV1AuthHealthTipBySlugSlug200;
}) {
  return (
    <article className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-4 text-sm text-muted-foreground">
        {article.category ? (
          <span>{article.category.display_name}</span>
        ) : (
          <span>Uncategorized</span>
        )}
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

      {article.sponsor.is_sponsored && (
        <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3.5 py-2.5">
          <Handshake className="h-4 w-4 shrink-0 text-primary/70" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {article.sponsor.sponsor_label ?? "Sponsored content"}{" "}
            <span className="text-muted-foreground/60">
              &mdash; This article is supported by a partner. Our editorial
              standards remain independent.
            </span>
          </p>
        </div>
      )}

      {article.author && (
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={article.author.avatar_url ?? undefined} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium capitalize">
              {article.author.username ?? "Anonymous"}
            </p>
            <p className="text-sm text-muted-foreground">Author</p>
          </div>
        </div>
      )}

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

      {article.tags.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag.name} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
