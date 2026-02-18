"use client";

import {
  Heart,
  Lightbulb,
  type LucideIcon,
  MessageCircle,
  Palette,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import type {
  GetApiV1AuthCampfireLanes200,
  GetApiV1AuthCampfireRealms200,
  GetApiV1AuthCampfireRealms200DataItem,
} from "@/api-client";
import {
  useGetApiV1AuthCampfireLanes,
  useGetApiV1AuthCampfireRealms,
} from "@/api-client";
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

// Map interaction styles to icons
const interactionStyleIcons: Record<InteractionStyle, LucideIcon> = {
  discussion: Users,
  support: Heart,
  guided: Lightbulb,
  creative: Palette,
};

const getRealmBgColor = (style: InteractionStyle): string => {
  const colorMap: Record<InteractionStyle, string> = {
    discussion: "bg-chart-3/20 text-chart-3 dark:bg-chart-3/10",
    support: "bg-primary/20 text-primary dark:bg-primary/10",
    guided: "bg-destructive/20 text-destructive dark:bg-destructive/10",
    creative: "bg-chart-2/20 text-chart-2 dark:bg-chart-2/10",
  };
  return colorMap[style] ?? "bg-muted text-muted-foreground";
};

const getRealmBorderColor = (style: InteractionStyle): string => {
  const colorMap: Record<InteractionStyle, string> = {
    discussion: "border-chart-3/30",
    support: "border-primary/30",
    guided: "border-destructive/30",
    creative: "border-chart-2/30",
  };
  return colorMap[style] ?? "border-border";
};

export const RealmOverview = () => {
  const [{ realm: realmKey }] = useFiltersServer();
  const session = useAppStore((s) => s.session);

  // Don't show card if "all" is selected
  if (realmKey === "all" || !realmKey) {
    return null;
  }

  return (
    <RealmOverviewContent
      realmKey={realmKey}
      accessToken={session.access_token}
    />
  );
};

const RealmOverviewContent = ({
  realmKey,
  accessToken,
}: {
  realmKey: string;
  accessToken: string;
}) => {
  const authHeaders = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    [accessToken],
  );

  // Fetch realms (deduplicated with other components via React Query)
  const realmsQuery = useGetApiV1AuthCampfireRealms({
    fetch: authHeaders,
  });

  const realms =
    realmsQuery.data?.status === 200
      ? (realmsQuery.data.data as GetApiV1AuthCampfireRealms200).data
      : [];

  const realm = useMemo(
    () => realms.find((r) => r.key === realmKey),
    [realms, realmKey],
  );

  // Fetch lanes for this realm
  const lanesQuery = useGetApiV1AuthCampfireLanes(
    { realmId: realm?.id ?? "" },
    {
      query: { enabled: !!realm?.id },
      fetch: authHeaders,
    },
  );

  const lanes =
    lanesQuery.data?.status === 200
      ? (lanesQuery.data.data as GetApiV1AuthCampfireLanes200).data
      : [];

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
  const style = realm.key as InteractionStyle;
  const IconComponent = interactionStyleIcons[style] ?? MessageCircle;

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

        {lanes.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};
