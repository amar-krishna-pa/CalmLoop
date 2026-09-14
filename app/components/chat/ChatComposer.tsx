"use client";

import CrisisSupportLink from "@/app/components/chat/CrisisSupportLink";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";

type Props = {
  input: string;
  isBusy: boolean;
  onInputChange: ({ value }: { value: string }) => void;
  onSubmit: () => void;
};

export default function ChatComposer({ input, isBusy, onInputChange, onSubmit }: Props) {
  return (
    <div>
      <HorizontalDivider />
      <div className="px-4 py-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="flex gap-2 items-center max-w-2xl mx-auto"
        >
          <textarea
            value={input}
            aria-label="Message"
            placeholder="Share what's on your mind…"
            rows={1}
            disabled={isBusy}
            onChange={(event) => onInputChange({ value: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
            className="input-base resize-none disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label={isBusy ? "Sending message" : "Send message"}
            disabled={isBusy || !input.trim()}
            className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isBusy ? <LoadingSpinner /> : "Send"}
          </button>
        </form>
        <CrisisSupportLink />
      </div>
    </div>
  );
}
