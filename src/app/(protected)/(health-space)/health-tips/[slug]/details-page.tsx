import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { PageContainer } from "@/components/app/page-container";
import { HealthTipFullArticle } from "@/features/health-space/health-tips/health-tip-full-article";
import { healthArticles } from "@/features/health-space/health-tips";
import { notFound } from "next/navigation";

export const HealthTipsDetailsPage = ({ slug }: { slug: string }) => {
  const article = healthArticles.find((article) => article.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <PageContainer
      title={article.title}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <PageHeading
        title={article.title}
        className="px-2 md:px-0"
        showBackButton
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <HealthTipFullArticle article={article} />
      </div>
    </PageContainer>
  );
};
