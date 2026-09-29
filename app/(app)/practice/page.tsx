import { Suspense } from "react";
import PracticeTabs from "@/app/components/practice/PracticeTabs";
import PracticeTabsLoader from "@/app/components/loaders/PracticeTabsLoader";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col overflow-y-auto p-6">
      <div className="mb-6 shrink-0">
        <h1 className="text-xl font-semibold text-primary">Practice</h1>
        <p className="mt-1 text-sm text-muted">
          Tools for practicing with uncertainty, at your own pace
        </p>
      </div>

      <Suspense
        fallback={
          <PracticeTabsLoader
            tab={typeof tab === "string" ? tab : undefined}
          />
        }
      >
        <PracticeTabs />
      </Suspense>
    </div>
  );
}
