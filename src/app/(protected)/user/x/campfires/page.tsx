import type { Metadata } from "next";
import { Suspense } from "react";
import { ManageCampfires } from "@/app/(protected)/user/x/campfires/manage-campfires";

export const metadata: Metadata = {
  title: "Manage Campfires",
  description: "Manage your campfires on Xolace",
};

const ManageCampfiresPage = () => {
  return (
    <Suspense>
      <ManageCampfires />
    </Suspense>
  );
};

export default ManageCampfiresPage;
