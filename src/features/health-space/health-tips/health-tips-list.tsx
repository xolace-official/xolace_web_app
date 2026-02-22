"use client";

import { HealthTipsArticles } from "./health-tips-articles";
import { HealthTipsToolbar } from "./health-tips-toolbar";

export const HealthTipsList = () => {
  return (
    <div className="flex flex-col gap-4">
      <HealthTipsToolbar />
      <HealthTipsArticles />
    </div>
  );
};
