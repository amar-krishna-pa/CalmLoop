const REFLECTIONS = [
  "One sentence can be enough for an entry.",
  "You can leave a question unanswered for the moment.",
  "A small practice step does not need to feel perfect.",
  "You can return to something that matters while uncertainty is present.",
  "There is no need to record every thought.",
  "You can choose how much to share.",
  "A difficult day does not erase earlier practice.",
  "You can pause and return to this later.",
  "Your next step can be smaller than you first planned.",
  "You do not need to finish every tool to use this space.",
];

export default function DailyQuoteCard() {
  const reflection = REFLECTIONS[(new Date().getDate() - 1) % REFLECTIONS.length];

  return (
    <div className="bg-card border border-subtle rounded-xl px-8 py-6 flex flex-col gap-3 col-span-full">
      <p className="text-xs font-medium text-muted uppercase tracking-widest">
        A moment to reflect
      </p>
      <p className="text-lg font-medium text-primary leading-relaxed">
        {reflection}
      </p>
    </div>
  );
}
