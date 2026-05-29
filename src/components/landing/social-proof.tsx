import { IS_BETA } from "@/lib/beta";

const quotes = [
  { name: "Aoife M.", school: "6th Year, Galway", text: "It actually makes me think. My maths teacher noticed." },
  { name: "Cian D.", school: "5th Year, Cork", text: "Asked it three times to just give me the answer. It kept asking better questions instead." },
  {
    name: "Saoirse K.",
    school: "6th Year, Dublin",
    text: IS_BETA
      ? "Using it for biology revision during the beta — helpful when I'm stuck on a concept."
      : "Replaced my EUR40/hr grinds for biology. I'm doing better in tests too.",
  },
];

export function SocialProof() {
  return (
    <section className="pb-24 bg-white">
      <div className="max-w-[1140px] mx-auto px-6">
        {IS_BETA && (
          <p className="text-center text-sm text-gray-500 mb-6 max-w-[520px] mx-auto">
            Early feedback from students trying the beta — your experience may differ as we improve the product.
          </p>
        )}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {quotes.map((q) => (
            <figure key={q.name} className="m-0 p-[22px] border border-gray-200 rounded-2xl bg-gray-50">
              <blockquote className="m-0 text-[15px] leading-relaxed text-gray-900">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3.5 text-[13px] text-gray-500">
                <span className="text-gray-700 font-medium">{q.name}</span> / {q.school}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
