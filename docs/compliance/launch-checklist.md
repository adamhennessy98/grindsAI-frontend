# GrindsAI: manual launch checklist

Use this after merging FE-2035e. No production configuration was changed by the local code fixes. Check off each step on the actual deployment, not only localhost.

## 1. Apply the legal acceptance migrations first

Open the production Supabase project's SQL editor and run these files in this order:

1. `supabase/migrations/20260829113000_legal_acceptance_audit.sql` (if not already installed).
2. `supabase/migrations/20261102190000_signup_legal_acceptance.sql`.

Do not rerun unrelated historical migrations. If your collaborator uses Supabase CLI migrations, have them apply the reviewed pending migrations instead. The schema/table/functions must be ready before deploying this branch: production blocks study access without current acceptance records.

See [legal-deployment.md](legal-deployment.md) for version updates, consent scope and verification cases.

## 2. Configure production environment variables

In the deployment host's environment settings, check:

- `NEXT_PUBLIC_SITE_URL=https://www.grindsai.com` (or the final canonical domain you actually use).
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the production project's values.
- `SUPABASE_SERVICE_ROLE_KEY`: the same project's server-only service-role key. This enables account deletion and Stripe profile updates. Never prefix it with `NEXT_PUBLIC_`, commit it, or paste it into a chat.
- `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`: configured and funded for the production environment.
- `BILLING_PRIVILEGED_EMAILS`: comma-separated founder emails that should have free access in production. The hardcoded local developer exceptions do not apply in production.
- Optional `OPENAI_API_KEY` / `RAG_VECTOR_ENABLED`: only if you are using vector retrieval.
- Optional `NEXT_PUBLIC_GA_MEASUREMENT_ID`: leave empty to use essential storage only.

Redeploy after changing environment variables so public/build-time configuration is refreshed.

## 3. Set up and verify Stripe

Create monthly EUR prices matching the UI and set:

| Environment variable | Price |
| --- | --- |
| `STRIPE_PRICE_INDIVIDUAL_SUBJECT_ID` | First subject: €10/month |
| `STRIPE_PRICE_ADDITIONAL_SUBJECT_ID` | Each additional subject: €5/month |
| `STRIPE_PRICE_UP_TO_SEVEN_SUBJECTS_ID` | Up to seven subjects: €25/month |
| `STRIPE_PRICE_UNLIMITED_SUBJECTS_ID` | Unlimited subjects: €30/month |

Set `STRIPE_SECRET_KEY`, the corresponding public key if used, and `STRIPE_WEBHOOK_SECRET`. Keep test-mode and live-mode keys/prices separate.

Register `https://www.grindsai.com/api/webhooks/stripe` as the webhook endpoint for the actual domain. The current handler processes:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Enable Stripe's customer portal for the cancellation/billing controls you intend to offer. In a test deployment, verify purchase, cancellation, profile subscription status updates, return to the app, and access removal after the subscription ends. Confirm founder exceptions still work.

Only enable `BILLING_ENFORCEMENT=true` once checkout, webhook, portal and the admin key work. Remove an old `CHAT_REQUIRES_SUBSCRIPTION=true` setting if it conflicts with your rollout plan. Public plan buttons no longer depend on invite-only mode, but payment still needs real configuration.

Official reference: [Stripe subscription webhooks](https://docs.stripe.com/billing/subscriptions/webhooks).

## 4. Configure auth and email delivery

In the production Supabase Auth settings:

- Set the Site URL to the canonical production domain.
- Allow the intended `/auth/callback` redirect URL for that domain. Add only the explicit development/preview redirects you need; keep production redirects narrow.
- Verify email sign-up and confirmation settings, production SMTP, sender domain and templates.
- Check sign-up confirmation and reset-password emails with a fresh disposable account in the browser/device flow students will use.
- If using Google, verify the provider is configured and set `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true`; otherwise keep the button off.

After confirmation, verify the Terms acceptance rows exist for the new account. Confirm an old account sees the review screen and that account/data/billing management remains accessible without accepting an update.

Official reference: [Supabase auth redirects](https://supabase.com/docs/guides/auth/redirect-urls).

## 5. Publish archive scans and verify deployed images

Local images work from `docs/processed/<subject-folder>/image_assets`. A deployment must either include these assets or serve them from external storage. The code now supports `PAST_PAPER_ASSET_BASE_URL` and explicitly traces archive Markdown into the server functions.

Recommended for the large image library: use a storage bucket/CDN for exam images. If using Supabase, create a public bucket such as `exam-archive` for exam scans only. Do not upload student work or account data to this public bucket. Check your rights to publish the exam material before making it public.

Upload the contents of each subject's `image_assets` folder under its app subject ID, preserving all folders and filenames. For example:

```text
Local: docs/processed/biology-rag-preprocessing/image_assets/exam_papers/higher/example.png
Bucket: biology/exam_papers/higher/example.png

Local: docs/processed/maths-rag-preprocessing/image_assets/marking_schemes/higher/example.png
Bucket: maths/marking_schemes/higher/example.png
```

Use the IDs in `src/lib/constants.ts`, including `applied-maths` and `computer-science`.

Set the deployment's base URL to the bucket root, without a subject suffix:

```text
PAST_PAPER_ASSET_BASE_URL=https://PROJECT.supabase.co/storage/v1/object/public/exam-archive
```

Redeploy. Open actual archive questions and marking schemes for Maths and Biology on the deployment preview, then sample the remaining subjects. Verify the images load with no 404s or CSP errors. If the variable is empty, the app uses local files instead; verify the deployment host actually includes them and stays within its server-function size limits.

Official reference: [Supabase serving public assets](https://supabase.com/docs/guides/storage/serving/downloads).

## 6. Review the archive content and legal drafts

The code filters known instruction-only fragments and deduplicates exact source copies; it cannot reliably reconstruct incorrectly numbered questions or infer missing topic tags. Have a teacher/content reviewer sample years and topics, especially Biology 2025, and repair the source preprocessing where numbering, question boundaries or scheme pairing is wrong. No source files were deleted by these filters.

Complete the sole trader's legal name, correspondence address, monitored contact inboxes, retention periods and provider/transfer details in the restored legal drafts. Obtain the previously requested legal/privacy review, including the minors/parent model. Finish the internal DPIA sign-off. The code records acknowledgement; it does not verify parental authority.

## 7. Final deployment checks using disposable accounts

- New sign-up, confirmation email, required legal acceptance and onboarding.
- Sign-in, profile edit/save, all four subject tools, recommendation destinations.
- One Tutor response, Topic Check completion and generated Exam Question.
- Archive topic filtering, scanned question and marking scheme images.
- Focus/result persistence after refresh and on another device.
- Sign out; verify opening `/chat` again requires sign-in.
- Account export, then deletion of a disposable account without an active subscription; verify it cannot sign back in. Never use a founder account for this test.
- Payment, cancellation, expired access, founder exemption and webhook delivery.
- Cookie preferences, analytics refusal/withdrawal, mobile layout and real phone keyboard.

Do not mark a check complete based solely on the local smoke report. Retain the deployment URL, test date and any failures for your release record.
