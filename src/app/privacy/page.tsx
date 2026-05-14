import type { Metadata } from "next";
import { LegalDocShell } from "@/components/legal/doc-shell";

export const metadata: Metadata = {
  title: "Privacy — GrindsAI",
  description: "How GrindsAI handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <LegalDocShell title="Privacy policy" updated="14 May 2026">
      <p>
        This is a placeholder privacy policy for early deployments. Replace it with counsel-reviewed text before
        marketing to a wide audience or processing sensitive student data at scale.
      </p>
      <h2>What we collect</h2>
      <p>
        Account details you provide (such as email), usage of the product (such as chat messages you send to the
        tutor), and technical diagnostics needed to run the service securely.
      </p>
      <h2>How we use data</h2>
      <p>
        We use your information to provide and improve GrindsAI, keep accounts secure, respond to support requests, and
        comply with law. Tutoring messages may be processed by an AI provider under our instructions.
      </p>
      <h2>Retention</h2>
      <p>
        We retain information as long as your account is active and for a reasonable period afterward for backups,
        security, and legal obligations.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about privacy:{" "}
        <a href="mailto:privacy@grindsai.ie" className="text-emerald-700 hover:underline">
          privacy@grindsai.ie
        </a>
        .
      </p>
    </LegalDocShell>
  );
}
