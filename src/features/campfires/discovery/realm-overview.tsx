"use client";

import {
  Flame,
  Heart,
  Lightbulb,
  type LucideIcon,
  MessageCircle,
  Palette,
  Users,
} from "lucide-react";
import type {
  GetApiV1AuthCampfireLanes200DataItem,
  GetApiV1AuthCampfireRealms200DataItem,
} from "@/api-client";
import {
  useGetApiV1AuthCampfireLanes,
  useGetApiV1AuthCampfireRealms,
} from "@/api-client";
import {
  extractApiDataArray,
  useAuthHeaders,
} from "@/features/campfires/campfire-api-utils";
import { useFiltersServer } from "@/components/shared/search-params";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { InteractionStyle } from "@/features/campfires";
import { useAppStore } from "@/providers/app-store-provider";

const VALID_INTERACTION_STYLES: ReadonlyArray<InteractionStyle> = [
  "support",
  "discussion",
  "guided",
  "creative",
];

function isValidInteractionStyle(value: string): value is InteractionStyle {
  return (VALID_INTERACTION_STYLES as readonly string[]).includes(value);
}

// Map interaction styles to icons
const interactionStyleIcons: Record<InteractionStyle, LucideIcon> = {
  discussion: Users,
  support: Heart,
  guided: Lightbulb,
  creative: Palette,
};

const getRealmBgColor = (style: InteractionStyle | undefined): string => {
  if (!style) return "bg-muted text-muted-foreground";
  const colorMap: Record<InteractionStyle, string> = {
    discussion: "bg-chart-3/20 text-chart-3 dark:bg-chart-3/10",
    support: "bg-primary/20 text-primary dark:bg-primary/10",
    guided: "bg-destructive/20 text-destructive dark:bg-destructive/10",
    creative: "bg-chart-2/20 text-chart-2 dark:bg-chart-2/10",
  };
  return colorMap[style];
};

const getRealmBorderColor = (style: InteractionStyle | undefined): string => {
  if (!style) return "border-border";
  const colorMap: Record<InteractionStyle, string> = {
    discussion: "border-chart-3/30",
    support: "border-primary/30",
    guided: "border-destructive/30",
    creative: "border-chart-2/30",
  };
  return colorMap[style];
};

export const RealmOverview = () => {
  const [{ realm: realmKey }] = useFiltersServer();
  const session = useAppStore((s) => s.session);

  if (realmKey === "all" || !realmKey) {
    return <AllRealmsOverview accessToken={session.access_token} />;
  }

  return (
    <RealmOverviewContent
      realmKey={realmKey}
      accessToken={session.access_token}
    />
  );
};

const AllRealmsOverview = ({ accessToken }: { accessToken: string }) => {
  const authHeaders = useAuthHeaders(accessToken);

  const realmsQuery = useGetApiV1AuthCampfireRealms({ fetch: authHeaders });
  const realms = extractApiDataArray<GetApiV1AuthCampfireRealms200DataItem>(
    realmsQuery.data,
  );

  return (
    <div className="flex items-start flex-col gap-6 border-2 border-border p-4 md:p-6">
      <div className="flex flex-col gap-3 w-full items-center justify-center">
        <div className="p-3 rounded-full bg-primary/10">
          <Flame className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">Welcome to Campfires</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xl leading-relaxed">
          Campfires are safe, focused spaces where people gather around shared
          experiences. No performance, no pressure — just honest conversations.
        </p>
      </div>

      {realmsQuery.isLoading ? (
        <div className="w-full grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      ) : realms.length > 0 ? (
        <div className="w-full grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {realms.map((realm) => {
            const style = isValidInteractionStyle(realm.key)
              ? realm.key
              : undefined;
            const Icon = style ? interactionStyleIcons[style] : MessageCircle;
            return (
              <div
                key={realm.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRealmBorderColor(style)} bg-card`}
              >
                <div
                  className={`p-1.5 rounded-md shrink-0 ${getRealmBgColor(style)}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{realm.name}</p>
                  {realm.description ? (
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {realm.description}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="text-center p-3 bg-muted/50 border border-border rounded-lg w-full max-w-2xl mx-auto">
        <p className="text-xs text-muted-foreground">
          Select a realm above to explore focused spaces, or browse all
          campfires below.
        </p>
      </div>
    </div>
  );
};

const RealmOverviewContent = ({
  realmKey,
  accessToken,
}: {
  realmKey: string;
  accessToken: string;
}) => {
  const authHeaders = useAuthHeaders(accessToken);

  // Fetch realms (deduplicated with other components via React Query)
  const realmsQuery = useGetApiV1AuthCampfireRealms({ fetch: authHeaders });
  const realms = extractApiDataArray<GetApiV1AuthCampfireRealms200DataItem>(
    realmsQuery.data,
  );
  const realm = realms.find((r) => r.key === realmKey);

  // Fetch lanes for this realm
  const lanesQuery = useGetApiV1AuthCampfireLanes(
    { realmId: realm?.id ?? "" },
    {
      query: { enabled: !!realm?.id },
      fetch: authHeaders,
    },
  );
  const lanes = extractApiDataArray<GetApiV1AuthCampfireLanes200DataItem>(
    lanesQuery.data,
  );

  if (realmsQuery.isLoading) {
    return (
      <div className="flex items-start flex-col gap-6 border-2 border-border p-4 md:p-6">
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!realm) {
    return null;
  }

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
        <RealmCard realm={realm} lanes={lanes.map((l) => l.name)} />
      </div>

      <div className="text-center mt-4 p-4 bg-muted/50 border border-border rounded-lg w-full max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground">
          Remember: Every realm is a judgment-free zone where authentic sharing
          and genuine connection are at the heart of every conversation.
        </p>
      </div>
    </div>
  );
};

const RealmCard = ({
  realm,
  lanes,
}: {
  realm: GetApiV1AuthCampfireRealms200DataItem;
  lanes: string[];
}) => {
  const style = isValidInteractionStyle(realm.key) ? realm.key : undefined;
  const IconComponent = style ? interactionStyleIcons[style] : MessageCircle;

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 border-2 ${getRealmBorderColor(style)} bg-card`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getRealmBgColor(style)}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {realm.name}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {realm.description ??
            "Discover and connect with communities that share your interests and values."}
        </CardDescription>

        {lanes.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Available lanes:</h4>
            <div className="flex flex-wrap gap-2">
              {lanes.map((lane) => (
                <span
                  key={lane}
                  className="inline-flex items-center px-3 py-1 rounded-sm text-xs border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {lane}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
