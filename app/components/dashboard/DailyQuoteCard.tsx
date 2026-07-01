const QUOTES = [
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
  },
  {
    text: "Anxiety is not your enemy. It is a messenger. The question is — are you willing to listen without obeying?",
    author: "Reid Wilson",
  },
  {
    text: "The goal is not to get rid of the thought. The goal is to change your relationship with it.",
    author: "Steven Hayes",
  },
  {
    text: "Courage is not the absence of fear. It is doing the thing you fear and discovering the fear was never in charge.",
    author: "Jonathan Grayson",
  },
  {
    text: "Every time you resist a compulsion, you are teaching your brain something new about what is actually dangerous.",
    author: "Jonathan Abramowitz",
  },
  {
    text: "Uncertainty is the natural condition of life. OCD's demand for certainty is the problem, not the solution.",
    author: "Sally Winston",
  },
  {
    text: "The discomfort of ERP is temporary. The freedom it builds is permanent.",
    author: "Edna Foa",
  },
  {
    text: "OCD is insatiable.",
    author: "Jeffrey M. Schwartz",
  },
  {
    text: "Face. Accept. Float. Let time pass.",
    author: "Claire Weekes",
  },
  {
    text: "When you confront the monster you fear the most, you'll defeat your fears.",
    author: "David D. Burns",
  },
];

function getDailyQuote() {
  const day = new Date().getDate();
  const group = (day - 1) % 10;
  return QUOTES[group % QUOTES.length];
}

export default function DailyQuoteCard() {
  const quote = getDailyQuote();

  return (
    <div className="bg-card border border-subtle rounded-xl px-8 py-6 flex flex-col gap-3 col-span-full">
      <p className="text-xs font-medium text-muted uppercase tracking-widest">
        Quote of the day
      </p>
      <blockquote className="text-lg font-medium text-primary leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <p className="text-sm text-accent">— {quote.author}</p>
    </div>
  );
}
