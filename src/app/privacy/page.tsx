import type { Metadata } from "next";
import { LegalDocShell } from "@/components/legal/doc-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How GrindsAI handles account, study, payment and analytics data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDocShell title="Privacy policy" updated="21 August 2026">
      <p>
        This policy explains how GrindsAI handles personal information when you use our website and study workspace.
        It is written as a practical summary and must be reviewed by qualified legal counsel before public launch.
      </p>
      <h2>Who this applies to</h2>
      <p>
        This policy applies to visitors, students, parents or guardians, and subscribers who use GrindsAI. If you are
        under 18, please involve a parent or guardian before purchasing a subscription or sharing information that is
        not needed for your study support.
      </p>
      <h2>What we collect</h2>
      <p>
        We collect account details you provide, such as your name and email address; the study profile you choose, such
        as subjects and levels; and study activity you create, such as Tutor messages, focus areas, Topic Check answers
        and results. We may also collect limited technical and security information required to operate and protect the
        service.
      </p>
      <h2>How we use data</h2>
      <p>
        We use this information to provide your study workspace, keep your chosen subjects and level in context, make
        support more relevant over time, keep accounts secure, respond to support requests, process subscriptions, and
        comply with legal obligations. Tutor messages may be processed by an AI provider acting under our instructions.
      </p>
      <h2>Service providers</h2>
      <p>
        We use specialist providers to run parts of GrindsAI, including authentication and database hosting, payment
        processing, and AI-assisted tutoring. Payment card details are handled by our payment processor rather than
        stored by GrindsAI. We only share information with providers where needed to deliver the service or meet legal
        and security obligations.
      </p>
      <h2>Analytics and cookies</h2>
      <p>
        Essential storage is used to keep accounts secure and remember necessary preferences. If Google Analytics is
        enabled, it remains off until you choose to accept it through the cookie preferences prompt. You can change that
        choice at any time through the Cookie preferences link in the site footer.
      </p>
      <h2>Retention</h2>
      <p>
        We retain account and study information while your account is active and for a limited period afterward where
        needed for backups, security, dispute handling, or legal obligations. Exact retention periods will be published
        once the production data-retention schedule is finalised.
      </p>
      <h2>Your choices</h2>
      <p>
        You can update your study profile, manage your subscription, and contact us about access, correction, deletion,
        or a copy of your personal information. We may need to verify your identity before responding to a request.
      </p>
      <h2>Keeping study information appropriate</h2>
      <p>
        Please do not include unnecessary sensitive personal information in Tutor messages, feedback, or uploaded
        study material. GrindsAI is a study service and is not designed for emergency, medical, legal, or counselling
        support.
      </p>
      <h2>Contact</h2>
      <p>
        Questions or requests about privacy:{" "}
        <a href="mailto:privacy@grindsai.ie" className="text-emerald-700 hover:underline">
          privacy@grindsai.ie
        </a>
        .
      </p>
    </LegalDocShell>
  );
}
