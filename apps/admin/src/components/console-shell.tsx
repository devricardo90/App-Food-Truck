type ConsoleCard = {
  title: string;
  value: string;
  hint: string;
};

type ConsoleShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: ConsoleCard[];
  children?: React.ReactNode;
};

export function ConsoleShell({
  eyebrow,
  title,
  description,
  cards,
  children,
}: ConsoleShellProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-stone-950">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          {description}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
            key={card.title}
          >
            <p className="text-sm font-medium text-stone-500">{card.title}</p>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-stone-950">
              {card.value}
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-600">{card.hint}</p>
          </article>
        ))}
      </div>

      {children}
    </section>
  );
}
