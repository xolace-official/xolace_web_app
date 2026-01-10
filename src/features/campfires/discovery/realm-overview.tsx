"use client";

import {
  Heart,
  Lightbulb,
  type LucideIcon,
  Palette,
  Sprout,
  Users,
} from "lucide-react";
import { useFiltersServer } from "@/components/shared/search-params";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CAMPFIRE_REALMS,
  type InteractionStyle,
  type RealmKey,
} from "@/features/campfires/discovery/index";

interface RealmCardData {
  key: InteractionStyle;
  name: string;
  description: string;
  lanes: string[];
  icon: LucideIcon;
}

// Realm Card Component
interface RealmCardProps {
  data: RealmCardData;
}

// Map interaction styles to icons
const interactionStyleIcons: Record<InteractionStyle, LucideIcon> = {
  collaborative: Users,
  supportive: Heart,
  motivational: Lightbulb,
  educational: Sprout,
  expressive: Palette,
};

const getRealmBgColor = (style: InteractionStyle): string => {
  const colorMap: Record<InteractionStyle, string> = {
    collaborative: "bg-chart-3/20 text-chart-3 dark:bg-chart-3/10",
    supportive: "bg-primary/20 text-primary dark:bg-primary/10",
    motivational: "bg-destructive/20 text-destructive dark:bg-destructive/10",
    educational: "bg-accent/20 text-accent-foreground dark:bg-accent/10",
    expressive: "bg-chart-2/20 text-chart-2 dark:bg-chart-2/10",
  };
  return colorMap[style];
};

const getRealmBorderColor = (style: InteractionStyle): string => {
  const colorMap: Record<InteractionStyle, string> = {
    collaborative: "border-chart-3/30",
    supportive: "border-primary/30",
    motivational: "border-destructive/30",
    educational: "border-accent/30",
    expressive: "border-chart-2/30",
  };
  return colorMap[style];
};

export const RealmOverview = () => {
  const [{ realm: realmKey }] = useFiltersServer();
  const selectedRealm: RealmKey = realmKey as InteractionStyle | "all";

  // Don't show card if "all" is selected
  if (selectedRealm === "all") {
    return null;
  }

  // Find the specific realm by key
  const realm = CAMPFIRE_REALMS.find((r) => r.key === selectedRealm);

  if (!realm) {
    return null;
  }

  const realmData: RealmCardData = {
    key: realm.key,
    name: realm.name,
    description:
      realm.description ||
      "Discover and connect with communities that share your interests and values.",
    lanes: realm.lanes.map((lane) => lane[1]),
    icon: interactionStyleIcons[realm.key],
  };

  return (
    <div
      className={
        "flex items-start flex-col gap-6 border-2 border-border p-4 md:p-6"
      }
    >
      <div className={"flex flex-col gap-2 w-full items-center justify-center"}>
        <h3 className={"text-2xl font-bold"}>Campfire Realm</h3>
        <p className={"text-sm text-muted-foreground text-center max-w-2xl"}>
          This realm represents a unique interaction style, creating focused
          spaces where meaningful conversations can flourish.
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <RealmCard data={realmData} />
      </div>

      <div className="text-center mt-4 p-4 bg-muted/50 border border-border rounded-lg w-full max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground">
          🔥 Remember: Every realm is a judgment-free zone where authentic
          sharing and genuine connection are at the heart of every conversation.
        </p>
      </div>
    </div>
  );
};

const RealmCard: React.FC<RealmCardProps> = ({ data }) => {
  const IconComponent = interactionStyleIcons[data.key];

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 border-2 ${getRealmBorderColor(data.key)} bg-card`}
    >
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getRealmBgColor(data.key)}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {data.name}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {data.description}
        </CardDescription>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Available lanes:</h4>
          <div className="flex flex-wrap gap-2">
            {data.lanes.map((lane) => (
              <span
                key={lane}
                className="inline-flex items-center px-3 py-1 rounded-sm text-xs border border-border bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {lane}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
