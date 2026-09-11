"use client";

import Modal from "@/app/components/common/Modal";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import FearOccurrences from "@/app/components/practice/prepare/fear-hierarchy/FearOccurrences";

type Props = {
  fear: { id: string; name: string; themes: string[]; behaviours: string[] };
  onClose: () => void;
};

export default function SavedFearModal({ fear, onClose }: Props) {
  return (
    <Modal title={fear.name} onClose={onClose} size="large">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <section className="space-y-2" aria-label="Themes">
          <h3 className="text-xs font-medium text-primary">Themes</h3>
          {fear.themes.length === 0 ? (
            <p className="text-xs text-muted">No themes saved.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {fear.themes.map((theme) => (
                <li
                  key={theme}
                  className="rounded-full border-2 border-accent bg-modal px-3 py-1.5 text-xs text-primary"
                >
                  {theme}
                </li>
              ))}
            </ul>
          )}
        </section>

        <HorizontalDivider />

        <section className="space-y-2" aria-label="Safety behaviours">
          <h3 className="text-xs font-medium text-primary">
            Safety behaviours
          </h3>

          {fear.behaviours.length === 0 ? (
            <p className="text-xs text-muted">No safety behaviours saved.</p>
          ) : (
            <ul className="list-disc space-y-2 pl-4 text-sm text-muted">
              {Array.from(new Set(fear.behaviours)).map((behaviour) => (
                <li key={behaviour} className="wrap-break-words">
                  {behaviour}
                </li>
              ))}
            </ul>
          )}
        </section>

        <HorizontalDivider />

        <FearOccurrences key={fear.id} fearId={fear.id} />
      </div>
    </Modal>
  );
}
