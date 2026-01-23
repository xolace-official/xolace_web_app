import { PostComposer } from "@/features/composer";
import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export const CreatePostPage = () => {
  return (
    <PageContainer
      title="Create Post🔥"
      contentClassName="max-sm:px-2"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <PostComposer />
      </div>
    </PageContainer>
  );
};
