type Exercise = {
  name: string;
  desc: string;
};

const EXERCISES: Exercise[] = [
  { name: "5-4-3-2-1", desc: "Ground yourself using your 5 senses" },
  { name: "Box Breathing", desc: "Inhale, hold, exhale, hold — 4 counts each" },
  { name: "Body Scan", desc: "Slowly scan tension from head to toe" },
  { name: "Cold Water", desc: "Splash cold water on your face or wrists" },
  { name: "Safe Place", desc: "Visualize a calm, safe environment" },
  { name: "Muscle Relax", desc: "Tense and release each muscle group" },
];

export default function GroundingExercisesCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-primary">Grounding Exercises</h2>

      <div className="grid grid-cols-2 gap-2">
        {EXERCISES.map((e) => (
          <button
            key={e.name}
            className="text-left p-3 rounded-lg bg-surface border border-subtle hover:border-accent/40 hover:bg-accent/5 transition-colors duration-150 cursor-pointer"
          >
            <p className="text-sm font-medium text-primary">{e.name}</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{e.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
