import { Suspense } from "react";
import PracticeTabs from "@/app/components/practice/PracticeTabs";
import PracticeTabsLoader from "@/app/components/loaders/PracticeTabsLoader";

export default async function PracticePage({ searchParams }: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Practice</h1>
        <p className="text-sm text-muted mt-1">Tools for practising with uncertainty, at your own pace</p>
      </div>

      <Suspense fallback={<PracticeTabsLoader tab={typeof tab === "string" ? tab : undefined} />}>
        <PracticeTabs />
      </Suspense>
    </div>
  );
}
