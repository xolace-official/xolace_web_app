import dynamic from "next/dynamic";
import { PageContainer } from "@/components/app/page-container";
import { LegalFooter } from "@/components/shared/legal-footer";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

const PostComposer = dynamic(
  () => import("@/features/composer/post-composer").then((m) => m.PostComposer),
  {
    loading: () => (
      <div className="h-[300px] animate-pulse rounded-2xl bg-muted" />
    ),
  },
);

export const CreatePostPage = () => {
  return (
    <PageContainer
      title="Create Post🔥"
      contentClassName="max-sm:px-2"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <div className="mx-auto w-full max-w-2xl md:px-4 py-6">
        <PostComposer />
      </div>

      <LegalFooter hideOnMobile={false} className="flex-none" />
    </PageContainer>
  );
};
