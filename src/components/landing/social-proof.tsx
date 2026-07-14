const quotes = [
  { name: "6th Year student", school: "Galway", text: "It makes me slow down and understand the first step instead of guessing." },
  { name: "5th Year student", school: "Cork", text: "The topic layout makes it easy to find what I actually need to practise." },
  {
    name: "6th Year student",
    school: "Dublin",
    text: "I like that it connects the tutor, practice questions, and test results in one place.",
  },
];

export function SocialProof() {
  return (
    <section className="bg-[#f4f8f6] pb-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {quotes.map((q) => (
            <figure key={q.name} className="m-0 rounded-2xl border border-violet-100 bg-violet-50/55 p-[22px]">
              <blockquote className="m-0 text-[15px] leading-relaxed text-gray-900">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3.5 text-[13px] text-gray-500">
                <span className="font-medium text-gray-700">{q.name}</span> / {q.school}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
