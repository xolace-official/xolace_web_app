// "use client";

// import { useRouter } from "next/navigation";
// import * as React from "react";

// import { EntityActionsMenu } from "./entity-actions-menu";
// import { buildEntityActions } from "./entity-actions-menu/entity-actions.builder";
// import { getEntityActionsPolicy } from "./entity-actions-menu/entity-actions.policy";
// import type { EntityTarget } from "./entity-actions-menu/entity-actions.types";
// import { useEntityActionsRunner } from "./entity-actions-menu/use-entity-actions-runner";

// /**
//  * In prod:
//  * - viewer comes from your auth/user store (or session hook)
//  * - prompt visibility state probably lives in the PostCard parent OR a local store
//  * - report sheet opener likely comes from a sheet context
//  */
// type PostCardActionsMenuProps = {
//   postId: string;
//   postAuthorId: string;
//   promptText?: string | null;
//   surface?: "post-card" | "post-detail"; // default post-card
// };

// export function PostCardActionsMenu({
//   postId,
//   postAuthorId,
//   promptText,
//   surface = "post-card",
// }: PostCardActionsMenuProps) {
//   const router = useRouter();
//   const runner = useEntityActionsRunner();

//   // ✅ Dummy viewer for now.
//   // In prod: replace with your real auth store/session
//   const viewer = React.useMemo(
//     () => ({ id: "user_abc", roles: ["blue_team"] as string[] }),
//     [],
//   );

//   // ✅ Local UI state for prompt visibility (dummy).
//   // In prod: you might lift this into PostCard or a store keyed by postId.
//   const [promptVisible, setPromptVisible] = React.useState(false);

//   const target: EntityTarget = React.useMemo(
//     () => ({
//       type: "post",
//       postId,
//       postAuthorId,
//       promptText,
//     }),
//     [postId, postAuthorId, promptText],
//   );

//   const context = React.useMemo(() => ({ surface }), [surface]);

//   // UI handlers (host capabilities)
//   const ui = React.useMemo(
//     () => ({
//       navigateToPost: (id: string) => router.push(`/post/${id}`),

//       afterPostDeleted: (id: string) => {
//         // Only meaningful on post-detail; safe no-op otherwise
//         if (surface === "post-detail") router.replace("/feed");
//       },

//       openReportSheet: (args: {
//         targetType: "post" | "comment";
//         postId?: string;
//         commentId?: number;
//       }) => {
//         // Dummy: replace with your report sheet context opener
//         console.log("open report sheet", args);
//       },

//       togglePostPromptVisibility: (id: string) => {
//         if (id !== postId) return;
//         setPromptVisible((v) => !v);
//       },

//       isPostPromptVisible: (id: string) =>
//         id === postId ? promptVisible : false,

//       confirm: async () => {
//         // Dummy confirm for now. Replace with your modal system later.
//         return window.confirm("Are you sure?");
//       },

//       notify: (args: {
//         kind: "success" | "error" | "info";
//         message: string;
//       }) => {
//         // Dummy. Later route to your toast system.
//         console.log(args.kind, args.message);
//       },
//     }),
//     [router, postId, promptVisible, surface],
//   );

//   // 1) policy
//   const policy = React.useMemo(
//     () => getEntityActionsPolicy({ viewer, target, context }),
//     [viewer, target, context],
//   );

//   // 2) actions list (builder)
//   const actions = React.useMemo(
//     () =>
//       buildEntityActions({
//         policy,
//         target,
//         context,
//         ui,
//         runner,
//       }),
//     [policy, target, context, ui, runner],
//   );

//   return (
//     <EntityActionsMenu
//       target={target}
//       context={context}
//       ui={ui}
//       actions={actions}
//       // optional: keep if you need to coordinate with a sheet
//       onOpenChange={() => {}}
//     >
//       {/* We'll add trigger-slot support later if you want.
//           For now EntityActionsMenu renders its own trigger SVG (from Step 1). */}
//     </EntityActionsMenu>
//   );
// }
