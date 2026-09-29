type Exercise = {
  name: string;
  desc: string;
};

const EXERCISES: Exercise[] = [
  { name: "5-4-3-2-1", desc: "Notice what you can see, hear, feel, smell or taste" },
  { name: "Box breathing", desc: "Inhale, hold, exhale, hold — 4 counts each" },
  { name: "Body scan", desc: "Notice how your body feels, without needing to change it" },
  { name: "Cold water", desc: "Splash cold water on your face or wrists" },
  { name: "Imagining a place", desc: "Picture a familiar place and notice its details" },
  { name: "Muscle relaxation", desc: "Tense and release each muscle group" },
];

export default function GroundingExercisesCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-primary">
          Grounding exercises
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Example exercises. Opening an exercise is not available yet.
        </p>
      </div>

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
