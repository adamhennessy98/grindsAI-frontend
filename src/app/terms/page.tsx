import type { Metadata } from "next";
import { LegalDocShell } from "@/components/legal/doc-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms governing use of the GrindsAI Leaving Certificate study workspace.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalDocShell
      title="Terms of use"
      updated="29 August 2026"
      summary="Pre-launch draft: these terms need review by an Irish solicitor and completion of the proprietor's legal name and correspondence address before paid subscriptions open."
    >
      <p>
        These terms apply when you use GrindsAI, including our website, account area, Tutor, Topic Checks, Exam
        Questions, Progress &amp; Results, and paid plans. GrindsAI is currently operated in Ireland by a sole trader
        trading as GrindsAI (the <strong>"Service"</strong>, <strong>"we"</strong>, <strong>"us"</strong> or
        <strong>"our"</strong>). The operator&apos;s legal name and correspondence address will be published here before
        paid subscriptions open.
      </p>
      <h2>1. Who can use GrindsAI</h2>
      <p>
        GrindsAI is designed for senior-cycle and Leaving Certificate study. You must provide accurate account
        information and keep your login details private. If you are under 18, ask a parent or guardian to review these
        terms and the Privacy Policy before creating an account or buying a plan. A parent or guardian must complete
        any purchase where that is required by law or by the payment provider.
      </p>
      <h2>2. What the Service does</h2>
      <p>
        GrindsAI provides subject-aware, AI-assisted study support. It can help you work through questions, practise
        Leaving Certificate-style questions, complete Topic Checks, and record study reflections. The Service is an
        educational support tool, not a school, exam authority, regulated tutoring service, or substitute for a
        teacher&apos;s professional judgement.
      </p>
      <h2>3. Important limits of AI-assisted help</h2>
      <p>
        Tutor and generated content can be incomplete, inaccurate, or unsuitable for your particular assessment. Use
        your judgement, check important information against reliable sources, and follow your school&apos;s rules on
        coursework, AI use, plagiarism and academic integrity. GrindsAI does not promise a particular grade, exam
        result, improvement, or availability of a specific feature or curriculum resource.
      </p>
      <h2>4. Your account and study content</h2>
      <p>
        You are responsible for activity on your account and must tell us promptly if you believe it has been accessed
        without permission. You retain ownership of material you submit, but give us a limited right to process it only
        to operate, secure, support and improve the Service as described in our <a href="/privacy">Privacy Policy</a>.
        Do not submit information about another person unless you have the right to do so.
      </p>
      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not use the Service unlawfully, abusively, or in a way that harms others.</li>
        <li>Do not attempt to bypass limits, gain unauthorised access, interfere with the Service, or probe its security.</li>
        <li>Do not share your account, resell access, or use automated tools to scrape or overload the Service.</li>
        <li>Do not upload material that infringes someone else&apos;s rights or use outputs to misrepresent your own work.</li>
        <li>Do not include unnecessary sensitive personal information in messages, answers, feedback, or uploads.</li>
      </ul>
      <h2>6. Subscriptions, payment and cancellation</h2>
      <p>
        Plan scope, price, billing frequency, renewal information and any trial terms are shown before checkout.
        Subscription payments are handled by Stripe or another stated payment provider; GrindsAI does not receive or
        store full payment-card details. Unless checkout says otherwise, subscriptions renew at the stated interval until
        cancelled. You can manage or cancel through the billing portal. Your statutory consumer rights are not limited
        by these terms. Any refund policy must be stated clearly at checkout and reviewed for Irish consumer-law
        compliance before launch.
      </p>
      <h2>7. Intellectual property and learning materials</h2>
      <p>
        The Service, software, branding and original content are protected by intellectual-property law. Past-paper
        questions, marking schemes, curriculum material and other third-party resources remain subject to the rights and
        permissions of their owners. Your access to these materials is for personal study only. You must not reproduce,
        distribute, sell or publish them except where permitted by law or the relevant rights holder.
      </p>
      <h2>8. Changes, suspension and ending access</h2>
      <p>
        We may change, suspend or remove features to maintain security, comply with law, or improve the Service. Where
        a material change affects a paid plan, we will give reasonable notice where practicable. We may suspend or close
        an account for a serious breach of these terms, fraud, security risk, or legal requirement. You may stop using
        the Service and request account deletion through your account settings, subject to lawful retention requirements.
      </p>
      <h2>9. Liability</h2>
      <p>
        Nothing in these terms excludes or limits liability that cannot legally be excluded or limited. Subject to that,
        GrindsAI is not liable for indirect loss, loss caused by reliance on an AI output without reasonable checking,
        or loss arising from circumstances outside our reasonable control. This section must be reviewed by an Irish
        solicitor before launch, particularly for consumer subscriptions.
      </p>
      <h2>10. Irish law, complaints and contact</h2>
      <p>
        These terms are governed by Irish law, without taking away any mandatory protections you have under the law of
        the country where you live. Please contact <a href="mailto:legal@grindsai.ie">legal@grindsai.ie</a> first with
        a question or complaint. Before public launch, this page must also include the sole trader&apos;s legal name and
        correspondence address, and any legally required consumer contact details.
      </p>
    </LegalDocShell>
  );
}
