const quotes = [
  { name: "6th Year student", school: "Galway", text: "It actually makes me think. My maths teacher noticed." },
  { name: "5th Year student", school: "Cork", text: "I can use it when I am stuck without it just handing me the answer." },
  { name: "6th Year student", school: "Dublin", text: "It helps me see where I am losing marks instead of just giving me another answer." },
];

export function SocialProof() { return <section className="bg-white pb-24"><div className="mx-auto grid max-w-[1140px] gap-4 px-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>{quotes.map((quote) => <figure key={quote.name + quote.school} className="m-0 rounded-2xl border border-gray-200 bg-gray-50 p-[22px]"><blockquote className="m-0 text-[15px] leading-relaxed text-gray-900">&ldquo;{quote.text}&rdquo;</blockquote><figcaption className="mt-3.5 text-[13px] text-gray-500"><span className="font-medium text-gray-700">{quote.name}</span> / {quote.school}</figcaption></figure>)}</div></section>; }
