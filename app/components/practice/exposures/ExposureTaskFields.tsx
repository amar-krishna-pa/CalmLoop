"use client";

import CompulsionsToAvoidEditor, {
  type CompulsionDraft,
} from "@/app/components/practice/exposures/CompulsionsToAvoidEditor";

export type ExposureTaskFieldErrors = {
  action?: string[];
  compulsionsToAvoid?: string[];
  expectedSuds?: string[];
};

type Props = {
  formId: string;
  fearName: string;
  action: string;
  compulsions: CompulsionDraft[];
  expectedSuds: number | null;
  fieldErrors: ExposureTaskFieldErrors;
  isSaving: boolean;
  onActionChange: ({ action }: { action: string }) => void;
  onCompulsionsChange: ({
    compulsions,
  }: {
    compulsions: CompulsionDraft[];
  }) => void;
  onExpectedSudsChange: ({
    expectedSuds,
  }: {
    expectedSuds: number | null;
  }) => void;
};

export default function ExposureTaskFields({
  formId,
  fearName,
  action,
  compulsions,
  expectedSuds,
  fieldErrors,
  isSaving,
  onActionChange,
  onCompulsionsChange,
  onExpectedSudsChange,
}: Props) {
  return (
    <fieldset
      disabled={isSaving}
      className="modal-scrollbar -m-1 min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto p-1"
    >
      <dl className="space-y-1.5 rounded-lg bg-modal-section/70">
        <dt className="text-xs font-medium text-muted">Saved fear</dt>
        <dd className="whitespace-pre-wrap wrap-break-words text-sm text-primary">
          {fearName}
        </dd>
      </dl>
      <div className="space-y-1.5">
        <label
          htmlFor={`${formId}-action`}
          className="text-xs font-medium text-primary"
        >
          Action to practice
        </label>
        <textarea
          id={`${formId}-action`}
          value={action}
          onChange={(event) => onActionChange({ action: event.target.value })}
          rows={2}
          maxLength={2000}
          aria-invalid={Boolean(fieldErrors.action)}
          aria-describedby={`${formId}-action-feedback`}
          className="input-base min-h-20 resize-y"
        />
        <p
          id={`${formId}-action-feedback`}
          aria-live="polite"
          className="text-xs text-danger empty:hidden"
        >
          {fieldErrors.action?.[0]}
        </p>
      </div>

      <div
        role="group"
        aria-label="Compulsions to avoid"
        aria-describedby={`${formId}-compulsions-feedback`}
      >
        <CompulsionsToAvoidEditor
          compulsions={compulsions}
          onChange={onCompulsionsChange}
        />
        <p
          id={`${formId}-compulsions-feedback`}
          aria-live="polite"
          className="text-xs text-danger empty:hidden"
        >
          {fieldErrors.compulsionsToAvoid?.[0]}
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${formId}-distress`}
          className="text-xs font-medium text-primary"
        >
          Expected distress
        </label>
        <p id={`${formId}-distress-help`} className="text-xs text-muted">
          How distressing do you expect this task to feel? 0 means no distress;
          10 means extreme distress.
        </p>
        <select
          id={`${formId}-distress`}
          value={expectedSuds ?? ""}
          onChange={(event) =>
            onExpectedSudsChange({
              expectedSuds:
                event.target.value === "" ? null : Number(event.target.value),
            })
          }
          aria-invalid={Boolean(fieldErrors.expectedSuds)}
          aria-describedby={`${formId}-distress-help ${formId}-distress-feedback`}
          className="input-base cursor-pointer"
        >
          <option value="">Choose a rating</option>
          {Array.from({ length: 11 }, (_, value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <p
          id={`${formId}-distress-feedback`}
          aria-live="polite"
          className="text-xs text-danger empty:hidden"
        >
          {fieldErrors.expectedSuds?.[0]}
        </p>
      </div>
    </fieldset>
  );
}
