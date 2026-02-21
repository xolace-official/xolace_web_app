import type { Metadata } from "next";
import { Suspense } from "react";
import { ManageCampfires } from "@/app/(protected)/user/x/campfires/manage-campfires";
import { PrimaryPageLoading } from "@/components/routes/primary-loading";

export const metadata: Metadata = {
  title: "Manage Campfires",
  description: "Manage your campfires on Xolace",
};

const ManageCampfiresPage = () => {
  return (
    <Suspense fallback={<PrimaryPageLoading />}>
      <ManageCampfires />
    </Suspense>
  );
};

export default ManageCampfiresPage;
