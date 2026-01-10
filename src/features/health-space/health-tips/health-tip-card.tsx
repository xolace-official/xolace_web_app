import { Clock, Tag, User, Sparkles, CircleArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HealthArticleInterface } from "@/features/health-space/health-tips/index";
import { Button } from "@/components/ui/button";

export const HealthTipCard = ({
  tip,
  onFullArticle,
}: {
  tip: HealthArticleInterface;
  onFullArticle: () => void;
}) => {
  const getSensitivityVariant = (
    level: string,
  ): "default" | "outline" | "destructive" => {
    switch (level) {
      case "general":
        return "default";
      case "mild":
        return "outline";
      case "sensitive":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-2">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={getSensitivityVariant(tip.sensitive_level)}
            className="font-medium"
          >
            {tip.category.display_name}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{tip.read_time_minutes} min read</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base md:text-xl font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
            {tip.title}
          </h3>

          {tip.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {tip.excerpt}
            </p>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 space-y-2">
        {tip.tags.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2">
              {tip.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-normal hover:bg-accent transition-colors cursor-pointer"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
              {tip.tags.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{tip.tags.length - 3}
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex-col gap-2 ">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={tip.author.avatar_url || undefined}
                alt={tip.author.username || "Author"}
              />
              <AvatarFallback className="text-xs">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {tip.author.username || "Anonymous"}
              </span>
            </div>
          </div>

          <Button variant={"link"} onClick={onFullArticle} className={"group"}>
            Full article
            <span className={"transition-transform group-hover:translate-x-1"}>
              <CircleArrowRight size={12} />
            </span>
          </Button>
        </div>

        {tip.sponsor.is_sponsored && (
          <div className="w-full">
            <div className="flex items-center gap-1 text-xs text-muted-foreground ">
              <Sparkles className="w-4 h-4" />
              <span>{tip.sponsor.sponsor_label || "Sponsored content"}</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
