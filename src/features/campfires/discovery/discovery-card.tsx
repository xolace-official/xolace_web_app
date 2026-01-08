import {
  CampfireDiscoveryInterface,
  InteractionStyle,
} from "@/features/campfires/discovery/index";
import Link from "next/link";
import {
  Users,
  Sparkles,
  MessageCircle,
  Heart,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/utils";
import { Button } from "@/components/ui/button";

const getInteractionConfig = (style: InteractionStyle) => {
  switch (style) {
    case "collaborative":
      return {
        icon: Users,
        iconColor: "text-accent",
      };
    case "supportive":
      return {
        icon: Heart,
        iconColor: "text-chart-1",
      };
    case "motivational":
      return {
        icon: Zap,
        iconColor: "text-chart-5",
      };
    case "expressive":
      return {
        icon: TrendingUp,
        iconColor: "text-chart-2",
      };
    case "educational":
      return {
        icon: Sparkles,
        iconColor: "text-chart-4",
      };
    default:
      return {
        icon: MessageCircle,
        iconColor: "text-muted-foreground",
      };
  }
};

export const DiscoveryCard = ({
  discovery,
}: {
  discovery: CampfireDiscoveryInterface;
}) => {
  const config = getInteractionConfig(discovery.interaction_style);
  const IconComponent = config.icon;

  return (
    <Link href={`/x/${discovery.slug}`}>
      {/* Desktop Card View - Hidden on Mobile */}
      <div className="hidden md:block group relative overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-1 shadow-sm">
        <div className="relative p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">
                {discovery.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={12} />
                <span className="font-medium">
                  {formatNumber(discovery.member_count)}
                </span>
              </div>
            </div>
            <Avatar className="h-8 w-8 shadow-primary/20 rounded-full border">
              <AvatarImage
                src={discovery.icon_path || undefined}
                alt={discovery.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 font-bold text-sm">
                {discovery.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
            {discovery.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/20">
            <div
              className={`flex items-center gap-1 text-xs font-medium ${config.iconColor}`}
            >
              <IconComponent size={12} />
              <span className="capitalize">{discovery.interaction_style}</span>
            </div>

            <Button variant={"link"} size={"sm"}>
              Join
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile List View - Hidden on Desktop */}
      <div
        className={`md:hidden group relative overflow-hidden rounded-lg border-2 bg-card transition-all active:scale-[0.98] shadow-sm`}
      >
        <div className="relative p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 shadow-primary/20 rounded-full border">
              <AvatarImage
                src={discovery.icon_path || undefined}
                alt={discovery.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-sm">
                {discovery.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-0.5 truncate">
                {discovery.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                {discovery.description}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users size={11} />
                  <span className="font-medium">
                    {formatNumber(discovery.member_count)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${config.iconColor}`}
                >
                  <IconComponent size={10} />
                  <span className="capitalize">
                    {discovery.interaction_style}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Button variant={"link"} size={"sm"}>
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
