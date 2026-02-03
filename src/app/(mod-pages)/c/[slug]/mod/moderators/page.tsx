import type { Metadata } from "next";
import ModsAndMembersTab from "@/features/mods/features/moderators/mods-and-members-tab";

export const metadata: Metadata = {
  title: "Moderator",
  description: "Discover moderator tool for managing their campfire",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const ModsPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <main>
      {/*<ModsAndMembersTab slug={slug}/>*/}
      <p>Mods page</p>
    </main>
  );
};

export default ModsPage;
