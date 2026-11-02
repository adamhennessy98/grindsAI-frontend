# Basic pre-launch functionality sweep

Date: 2 November 2026. Target: localhost:3000 on FE-2035e, using the owner's supplied test account. This checks normal feature mechanics, not a security penetration test or full curriculum/content validation.

## Follow-up fixes verified

The subsequent fix pass added normal Sign out, fixed all four home recommendation destinations and topic preservation, removed the identified instruction fragment and duplicate archive copies, restored frontmatter-only scan display, and added optional external archive image storage. Browser checks at 390px confirmed all four recommendation targets, Calculus topic selection, Maths/Biology image requests, and Sign out followed by protected API rejection (401). No browser exceptions occurred. Account deletion still needs the server key and a disposable-account test. Remaining manual tasks are in [launch-checklist.md](launch-checklist.md). Findings below record the original sweep.

## Working in this run

- Email/password sign-in reaches My Subjects; the subject Open action reaches the four-tool workspace.
- Maths Tutor returns a real streamed response under Algebra.
- Maths Exam Questions returns a real generated Algebra question, hint and worked solution.
- Maths Topic Check excludes General, generated eight questions, accepted eight answers, returned successful review responses and persisted an assisted completion record. The test supplied generated reference solutions to check the marking flow, not to assess learning quality.
- Completion displayed question-by-question assessments and the next-action buttons. The test harness initially waited for the supported-completion heading, but the all-correct branch uses a different heading; that wait timeout was a harness expectation issue, not a failed completion. The rendered reviews and saved completion were checked separately.
- Embedded question Tutor opens inside Topic Check and returns successfully. Assisted count is recorded as one.
- Archive list endpoints return non-empty Higher Level results for all 17 subjects. Coordinate Geometry filtering returns only Coordinate Geometry entries in the sampled Maths request.
- Sampled Maths and Biology archive image endpoints return 200 image/png. This verifies local assets, not deployment packaging.
- Progress focus addition, mark comfortable, restore and result logging work; records remain after refresh. Temporary focus/result test entries were removed.
- At 390px the Tutor drawer opens, selects Calculus and closes. The composer is visible at the bottom and the document has no horizontal overflow. Light/dark switching works.
- Profile editing navigates to /onboarding?edit=1; account page loads and data export returns JSON successfully. Profile changes were not submitted.
- No browser JavaScript exceptions occurred during the completed smoke flows.

## Findings to resolve before public launch

1. **No normal Sign out action.** The only auth.signOut call is in the account-deletion handler. Add an accessible Sign out action to account settings, especially for shared student devices. Evidence: src/app/account/account-page-client.tsx.
2. **Archive entries include extraction artefacts.** Biology 2025 Section A/B Question 1 displays only “Section B, leaving 120 minutes for Section C.” Its displayed marking text is also a section instruction. Filter or repair invalid chunks and review numbering/duplicates before presenting the whole archive as complete. Evidence: docs/processed/biology-rag-preprocessing/output_question_chunks/higher/topic_specific/biology_higher_2025_section_a_b_q001_plant_biology.md. The API reports this entry has a visual, but its rendered question contains no image because visual_assets frontmatter is not used when constructing the displayed Markdown.
3. **Account deletion cannot be verified with the current environment.** It depends on SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY), neither of which is configured in .env.local. Configure the server-only key on deployment and exercise deletion with a disposable account. Do not test by deleting the owner's account.
4. **Home recommendations lose their destination type.** Code inspection: StructuredContinuationCard invokes onContinueSubject with only subject/topic; continueSubject always opens conversation. Recommendations for Topic Check or Exam Questions can therefore open Tutor instead. Preserve the recommendation action when routing.

## Known deployment dependencies

- Legal acceptance migrations are absent from the connected database. Follow legal-deployment.md before production deployment. Local development permits existing sign-in while that RPC is missing; production does not.
- Stripe credentials/prices/webhook/portal and an actual test checkout remain to be configured/verified. Plan display and unauthenticated plan-to-login routing were checked in the preceding pass, not a real purchase.
- Re-test archived images on the deployment preview. Production asset packaging was not verified by the local checks.
- Legal document owner details and external review remain outstanding as already documented.

## Not exercised

New-account email delivery/confirmation, password-reset email delivery, a real payment/cancellation, real account deletion, every topic/level/subject's AI output, real phone keyboard behaviour and the deployed environment. Test study activity from the live Tutor/generator/Topic Check checks remains on the supplied testing account; temporary manual focus and result records were removed.

## Quality-of-life follow-up

- Browser Back/Forward follows My Subjects -> subject -> tool; refresh restores the selected tool/topic. Topic changes replace the current history entry.
- Unsent Tutor text, result-entry drafts and unfinished Topic Check answers recover from account-scoped sessionStorage in the same tab. Sign out clears that account's tab drafts. Storage-blocked browsers cannot recover drafts; unfinished result/check navigation still warns.
- Progress saves are queued; result logging waits for server acknowledgement, preserves fields on failure and uses a stable result ID across draft recovery/retry. A Retry sync control is available after failed progress saves.
- Mobile topic and archive question dialogs use native modal focus containment, Escape dismissal and focus restoration.
- Long generator/review requests show an additional wait explanation after 20 seconds; Exam Questions offers Retry without resetting settings.
- Tutor composer now uses available parent height rather than a hard-coded header offset, has a labelled input, 16px mobile text and a 44px Send target. Focus-area actions also have 44px minimum height.
- Automated browser checks passed: Back/Forward, refresh recovery, drawer Escape/focus restoration, failed-result field preservation, successful retry, unfinished-check confirmation/recovery and generator retry/settings preservation. Generation and save-failure/retry responses were mocked for this follow-up; no real AI calls or fake test results were saved to the account by those tests.
- Inspected light/dark screenshots. Topic Check and Tutor were checked for document overflow at 360, 390, 430, 768, 1024 and 1440px; Tutor Send remained within the viewport. A real phone/software keyboard still needs a device test.
- Unit suite: 34 tests passed. The temporary browser harness was removed after verification.
