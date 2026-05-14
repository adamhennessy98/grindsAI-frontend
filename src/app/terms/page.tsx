import type { Metadata } from "next";
import { LegalDocShell } from "@/components/legal/doc-shell";

export const metadata: Metadata = {
  title: "Terms — GrindsAI",
  description: "Terms of use for GrindsAI.",
};

export default function TermsPage() {
  return (
    <LegalDocShell title="Terms of use" updated="14 May 2026">
      <p>
        These placeholder terms govern early access to GrindsAI. Replace with counsel-reviewed terms before charging
        customers or making binding commitments in marketing.
      </p>
      <h2>The service</h2>
      <p>
        GrindsAI provides AI-assisted study tools. It is not a replacement for a registered teacher, school, or exam
        board. You are responsible for how you use outputs in coursework and exams, including your school&apos;s rules
        on academic integrity.
      </p>
      <h2>Accounts</h2>
      <p>
        You must provide accurate information, keep credentials confidential, and notify us if you suspect unauthorized
        access.
      </p>
      <h2>Acceptable use</h2>
      <ul>
        <li>No unlawful, harassing, or harmful content.</li>
        <li>No attempts to break, overload, or reverse engineer the service except as permitted by law.</li>
        <li>No use of the service to generate disallowed content in educational contexts.</li>
      </ul>
      <h2>Subscriptions</h2>
      <p>
        Paid plans, trials, renewals, and refunds are described at checkout and in any separate agreement presented at
        purchase. Taxes may apply based on your location.
      </p>
      <h2>Disclaimer</h2>
      <p>
        The service is provided &quot;as is&quot; to the maximum extent permitted by law. AI outputs may be incorrect;
        always verify critical facts with authoritative sources.
      </p>
      <h2>Contact</h2>
      <p>
        Legal questions:{" "}
        <a href="mailto:legal@grindsai.ie" className="text-emerald-700 hover:underline">
          legal@grindsai.ie
        </a>
        .
      </p>
    </LegalDocShell>
  );
}
