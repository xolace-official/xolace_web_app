"use client";
import { Crown, Globe, TicketCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatDate, formatNumber } from "@/utils";
import { CampfireInterface } from "@/features/campfires";
import { getPurposeDescription, getRankInfo } from "@/features/campfires";
import CampfireAvatar from "@/features/campfires/campfire-details/campfire-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface CampfireAboutProps {
  campfire: CampfireInterface;
  setDrawerOpen: (open: boolean) => void;
}

// Dummy data for user
const user = {
  id: "id",
  username: "FedeJnr",
  avatar_url:
    "https://images.unsplash.com/photo-1768797767719-dad3da9a6e09?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

// Dummy data for rules
// Dummy data for rules
const rules: { id: string; title: string; description: string }[] = [
  {
    id: "rule-1",
    title: "Be respectful to everyone",
    description:
      "Treat all members with respect. Harassment, hate speech, personal attacks, or discrimination of any kind will not be tolerated.",
  },
  {
    id: "rule-2",
    title: "Stay on topic",
    description:
      "Posts and comments should be relevant to this campfire’s purpose. Off-topic discussions may be removed to keep conversations focused.",
  },
  {
    id: "rule-3",
    title: "No spam or self-promotion",
    description:
      "Avoid excessive self-promotion, referral links, or unsolicited advertisements. Share value first before promoting anything.",
  },
  {
    id: "rule-4",
    title: "Follow community guidelines",
    description:
      "All members must follow the platform’s general community guidelines in addition to the rules specific to this campfire.",
  },
  {
    id: "rule-5",
    title: "Listen to moderators",
    description:
      "Moderators have the final say in enforcing rules. If a moderator asks you to stop or adjust behavi",
  },
];

const CampfireAbout = ({ campfire, setDrawerOpen }: CampfireAboutProps) => {
  const rankInfo = getRankInfo(campfire?.member_count);
  const [rulesLoading, setRulesLoading] = useState(false);

  return (
    <div className="flex items-start flex-col pt-4 pb-16 md:py-4 gap-4 bg-muted rounded-lg text-sm">
      <div className="flex items-start flex-col gap-4 px-4 py-2 w-full">
        <h2 className={"font-semibold"}>
          <span className="uppercase">About</span> {campfire.name}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            {campfire.description ||
              getPurposeDescription(campfire?.interaction_style)}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="flex items-center gap-2">
            <TicketCheck size={16} />
            Created{" "}
            {formatDate(campfire.created_at || new Date().toISOString())}
          </span>
          <span className="flex items-center gap-2 uppercase">
            <Globe size={16} />
            {campfire.visibility} Community
          </span>
        </div>
        <Button
          size={"sm"}
          className={"w-full items-center h-8 border rounded-full"}
          onClick={() => setDrawerOpen(true)}
        >
          Campfire Guide
        </Button>

        <div className="w-full flex flex-row items-center justify-between text-xs">
          <div className="flex flex-col items-start">
            <span className="font-light">
              {formatNumber(campfire.member_count)}
            </span>
            <span>Members</span>
          </div>

          <div className="flex flex-col items-start">
            <span className="font-semibold flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {/* {Math.floor(campfire.members * 0.05)} Approximate online users */}
              Online
            </span>
          </div>

          <div className="flex flex-col items-start">
            <span className={`font-semibold ${rankInfo.color}`}>
              {rankInfo.rank}
            </span>
            <span>Rank by size</span>
          </div>
        </div>
      </div>
      <Separator className="border" />

      {/* User section - show current user's role if they're a member */}
      {user && campfire.isMember && (
        <>
          <div className="flex flex-col gap-4 py-2 px-4">
            <CampfireAvatar
              avatarUrl={
                user.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
              }
              username={user.username || "Anonymous"}
              userRoute={`/profile/${user.username}`}
              assignedRole={campfire.memberRole}
              title="Your role in this campfire"
            />
          </div>
          <Separator className="border dark:border-neutral-600 " />
        </>
      )}

      {/*campfire rules section*/}
      <div className="flex flex-col gap-4 py-2 px-4 w-full">
        <h2 className="uppercase font-semibold">{campfire.name} Rules</h2>

        {rulesLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-12 w-full rounded-md bg-neutral-200 dark:bg-neutral-700"
              />
            ))}
          </div>
        ) : rules.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={rules[0]?.id.toString()}
          >
            {rules.map((rule, index) => (
              <AccordionItem
                value={rule.id.toString()}
                key={rule.id}
                className="px-2 py-1 border-none hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
              >
                <AccordionTrigger className="w-full flex items-center justify-between gap-2 py-2 text-left">
                  <span className="flex items-center gap-2 font-bold text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {index + 1}.
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {rule.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2 text-neutral-600 dark:text-neutral-300">
                  {rule.description ||
                    "Please follow this community guideline."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-4 text-neutral-500">
            <p>No specific rules have been set for this campfire.</p>
            <p className="text-xs mt-1">General community guidelines apply.</p>
          </div>
        )}
      </div>
      <Separator className="border" />

      {/* Fire starters section */}
      <div className="flex flex-col gap-4 py-2 px-4">
        <h2 className="uppercase font-semibold flex items-center gap-2">
          <Crown size={16} />
          Moderators
        </h2>

        {/*{membersLoading ? (*/}
        {/*  <div className="space-y-3">*/}
        {/*    {[1, 2, 3].map(i => (*/}
        {/*      <div key={i} className="flex items-center gap-3">*/}
        {/*        <Skeleton className="h-8 w-8 rounded-full" />*/}
        {/*        <div className="space-y-1">*/}
        {/*          <Skeleton className="h-4 w-24" />*/}
        {/*          <Skeleton className="h-3 w-16" />*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*) : fireStarters.length > 0 ? (*/}
        {/*  <div className="w-full flex flex-col gap-2 items-start">*/}
        {/*    {fireStarters.slice(0, 4).map((fireStarter) => (*/}
        {/*      <CampfireAvatar*/}
        {/*        key={fireStarter.user_id}*/}
        {/*        avatarUrl={fireStarter.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fireStarter.user_id}`}*/}
        {/*        username={fireStarter.username}*/}
        {/*        userRoute={`/profile/${fireStarter.username}`}*/}
        {/*        assignedRole={fireStarter.role === 'firestarter' ? 'Firestarter' : 'Firekeeper'}*/}
        {/*        signedUrls={signedUrls}*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*) : (*/}
        {/*  <div className="text-center py-4 text-neutral-500">*/}
        {/*    <p>No moderators assigned yet.</p>*/}
        {/*  </div>*/}
        {/*)}*/}

        <Button
          size="sm"
          variant="outline"
          className="w-full h-8 border border-border rounded-full"
          asChild
        >
          <Link href={`/campfires/${campfire.slug}/members`}>
            View all fire starters
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CampfireAbout;
