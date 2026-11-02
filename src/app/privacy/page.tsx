import type { Metadata } from "next";
import { LegalDocShell } from "@/components/legal/doc-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How GrindsAI handles account, study, payment and analytics data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDocShell
      title="Privacy policy"
      updated="29 August 2026"
      summary="Pre-launch draft: before public launch, complete the data-controller details, processor list, transfer safeguards and retention schedule, then obtain Irish privacy-law review."
    >
      <p>
        This policy explains how GrindsAI handles personal data when you use our website and study workspace. GrindsAI
        is currently operated in Ireland by a sole trader trading as GrindsAI. Before launch, this policy will name the
        sole trader&apos;s legal name and correspondence address as the data controller.
      </p>
      <h2>1. Who this applies to</h2>
      <p>
        This policy applies to visitors, students, parents or guardians, and subscribers who use GrindsAI. If you are
        under 18, please involve a parent or guardian before buying a subscription or sharing information that is not
        needed for your study support. GrindsAI is built for students, so we aim to explain data practices in clear,
        age-appropriate language and to collect only information needed for the study service.
      </p>
      <h2>2. Personal data we collect</h2>
      <p>
        Depending on how you use the Service, we collect account details such as email address and authentication
        information; study-profile details such as year group, subjects and levels; study activity such as Tutor
        messages, focus areas, Topic Check answers, generated-question interactions and results; billing identifiers
        and subscription status; support correspondence; cookie preferences; and limited device, log and security data.
        We do not ask for special-category data such as health information. Please do not put unnecessary sensitive or
        highly personal information into a Tutor message or upload.
      </p>
      <h2>3. Why we use it and legal bases</h2>
      <p>
        We use account and study data to provide your workspace and subject-aware support, authenticate you, remember
        study context, process payment, respond to you, keep the Service secure, investigate misuse, and meet legal
        obligations. We rely on performance of our contract with you, our legitimate interests in operating and securing
        the Service, legal obligations, and consent where required, such as optional analytics. Before launch, the
        lawful-basis assessment must be finalised against the actual processing configuration.
      </p>
      <h2>4. AI-assisted study support</h2>
      <p>
        When you use Tutor or generate learning content, relevant study content may be sent to AI service providers so
        they can return a response. We currently use Anthropic for Tutor and question generation and may use OpenAI for
        retrieval embeddings where that optional system is enabled. AI outputs are not used to make decisions that have
        legal or similarly significant effects about you. Do not include information that is not needed for your study
        question.
      </p>
      <h2>5. Who receives personal data</h2>
      <p>
        We use specialist service providers to operate parts of GrindsAI. These include Supabase for authentication and
        data storage, Stripe for subscriptions and payment processing, Anthropic and potentially OpenAI for the
        AI-assisted features described above, and Google Analytics only where you choose optional analytics. We may also
        use hosting, email, support and security providers. Providers receive only the data needed for their service and
        must be reviewed under appropriate contractual and security arrangements before launch.
      </p>
      <h2>6. International transfers</h2>
      <p>
        Some providers may process data outside the European Economic Area. Before any such production transfer, we
        will document the destination, transfer mechanism and supplementary safeguards where required. The published
        processor list will be updated when these arrangements are finalised.
      </p>
      <h2>7. Retention and deletion</h2>
      <p>
        We keep account and study data for as long as your account is active, then only as long as needed for deletion
        requests, security, backups, dispute handling, tax or other legal obligations. Exact retention periods and
        backup-deletion windows must be approved and inserted before launch. You can request deletion through account
        settings; deleting an account does not remove information we must lawfully retain.
      </p>
      <h2>8. Your rights and choices</h2>
      <p>
        Subject to applicable law, you may ask for access, correction, deletion, restriction, objection, portability,
        or to withdraw consent for optional processing. You can also update your profile, cancel a subscription, export
        available account data and change cookie preferences. We may need to verify your identity before responding.
        You can complain to the{" "}
        <a href="https://www.dataprotection.ie/en/individuals/exercising-your-rights">Irish Data Protection Commission</a>{" "}
        if you are unhappy with how we handle your data.
      </p>
      <h2>9. Cookies and consent</h2>
      <p>
        Essential storage is used for security, authentication and requested preferences. Optional Google Analytics
        stays off unless you choose to accept it. You can change that choice at any time through Cookie preferences in
        the footer. Read more on the <a href="/consent">Consent and cookies</a> page.
      </p>
      <h2>10. Security and updates</h2>
      <p>
        We use technical and organisational measures designed to protect data, including access controls and
        authenticated account access. No internet service can guarantee absolute security. We may update this policy
        when our processing changes; material updates will be communicated in an appropriate way.
      </p>
      <h2>11. Contact</h2>
      <p>
        For privacy requests, contact <a href="mailto:privacy@grindsai.ie">privacy@grindsai.ie</a>. Before launch,
        this page must be updated with the data controller&apos;s legal name, correspondence address and the final contact
        route for data-protection requests.
      </p>
    </LegalDocShell>
  );
}
