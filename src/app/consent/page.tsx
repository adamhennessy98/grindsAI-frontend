import type { Metadata } from "next";
import { LegalDocShell } from "@/components/legal/doc-shell";

export const metadata: Metadata = {
  title: "Consent and cookies",
  description: "How GrindsAI asks for consent and how to manage optional cookies and communications.",
  alternates: { canonical: "/consent" },
};

export default function ConsentPage() {
  return (
    <LegalDocShell
      title="Consent and cookies"
      updated="29 August 2026"
      summary="When you create an account, GrindsAI records the current Terms, Privacy Policy and Consent/Cookies document versions, together with a server timestamp."
    >
      <p>
        GrindsAI needs some information to provide your account and study workspace. Other uses, such as optional
        analytics, should only happen when you choose them. This page explains the difference and how to change your
        mind.
      </p>
      <h2>1. Using the study service</h2>
      <p>
        Creating an account and using GrindsAI is subject to our <a href="/terms">Terms of use</a>{" "}and{" "}
        <a href="/privacy">Privacy Policy</a>. We process the information needed to provide and secure the Service.
        This is not the same as asking you to agree to optional advertising or analytics.
      </p>
      <h2>2. Students under 18</h2>
      <p>
        GrindsAI is for senior-cycle students. If you are under 18, please ask a parent or guardian to read these pages
        before you subscribe or share information beyond what is needed for study support. We aim to keep explanations
        clear and do not ask you to share unnecessary sensitive personal information.
      </p>
      <h2>3. Essential storage</h2>
      <p>
        Essential cookies and similar storage help keep you signed in, protect the Service, remember necessary
        preferences and make account functions work. You cannot opt out of these while using the account features.
      </p>
      <h2>4. Optional analytics</h2>
      <p>
        If enabled, Google Analytics helps us understand which public pages are useful and where the site needs
        improvement. It is off until you select <strong>Accept analytics</strong> in the cookie prompt. Choosing
        <strong>Essential only</strong> does not affect your ability to use GrindsAI. You can change your choice at any
        time using Cookie preferences in the footer.
      </p>
      <h2>5. Marketing</h2>
      <p>
        GrindsAI does not currently use your Tutor conversations, answers or study profile to send marketing. If we add
        marketing email or another optional communication, we will ask separately and explain how to unsubscribe.
      </p>
      <h2>6. Keeping a record of choices</h2>
      <p>
        When you create an account or are asked to review updated documents, GrindsAI records the date, account
        identifier, document version and acceptance source for the Terms, Privacy Policy and this Consent/Cookies
        information. Optional analytics choices are stored separately so they can be changed without affecting access
        to the study service.
      </p>
      <h2>7. Questions or changes</h2>
      <p>
        You can change cookie preferences through the footer or contact{" "}
        <a href="mailto:privacy@grindsai.ie">privacy@grindsai.ie</a>{" "}
        with a privacy question. For more detail, read our <a href="/privacy">Privacy Policy</a>.
      </p>
    </LegalDocShell>
  );
}
