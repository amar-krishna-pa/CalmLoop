export default function ChatDemoSection() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-20">
      <div className="rounded-2xl border border-subtle bg-card shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-subtle bg-surface/40 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-xs text-muted font-medium">
            CalmLoop Journaling Assistant
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Chat Interface Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* User Input Bubble */}
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-surface border border-subtle flex items-center justify-center text-xs font-bold text-muted shrink-0">
              U
            </div>
            <div className="bg-surface/50 border border-subtle rounded-xl rounded-tl-none p-5 flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-muted">
                  Intrusive Thought & Compulsion
                </span>
                <span className="text-[10px] bg-warning-bg text-warning-text px-2 py-0.5 rounded-full font-medium">
                  Spike
                </span>
              </div>
              <p className="text-sm md:text-base leading-relaxed">
                &quot;I checked the front door lock four times before leaving,
                but I still feel like it might be open. If I don&apos;t go back
                and check a fifth time, someone might break in and it will be my
                fault.&quot;
              </p>
            </div>
          </div>

          {/* AI Reflection Bubble */}
          <div className="flex items-start gap-4 max-w-3xl ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-bold text-accent shrink-0">
              CL
            </div>
            <div className="bg-accent/5 dark:bg-accent/10 border border-accent/20 rounded-xl rounded-tr-none p-5 flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-accent">
                  CalmLoop ERP Response
                </span>
                <span className="text-[10px] bg-accent/20 text-accent dark:text-accent px-2 py-0.5 rounded-full font-medium">
                  Exposure
                </span>
              </div>
              <p className="text-sm md:text-base leading-relaxed mb-4">
                It sounds like the anxiety is urging you to seek 100% certainty.
                Checking the door again might make the anxiety drop temporarily,
                but it keeps the checking loop alive.
              </p>
              <div className="border-t border-accent/20 pt-3">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                  Recommended Response Action:
                </p>
                <p className="text-sm italic text-muted">
                  &quot;Can you try to move forward with your day while letting
                  the feeling of uncertainty ride along in the passenger seat?
                  State to yourself: &apos;Maybe the door is unlocked, maybe it
                  isn&apos;t. I am going to choose to trust my memory and let
                  the anxiety sit.&apos;&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
