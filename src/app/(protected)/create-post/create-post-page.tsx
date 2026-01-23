import { PostComposer } from "@/features/composer";
import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { LegalFooter } from "@/components/shared/legal-footer";

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
