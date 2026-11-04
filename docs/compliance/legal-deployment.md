# Legal pages and acceptance deployment

For the full manual release checklist (server keys, payments, email and archive images), see [launch-checklist.md](launch-checklist.md).

1. Apply `supabase/migrations/20260829113000_legal_acceptance_audit.sql` if not already installed.
2. Apply `supabase/migrations/20261102190000_signup_legal_acceptance.sql`.
3. Deploy this branch. Production requires acceptance records before study access. Local development alone permits an existing account to sign in while the RPC is missing.
4. Verify email signup with confirmation enabled, immediate-session signup, OAuth signup, and an existing user's review screen. The signup trigger captures acceptance at creation; OAuth users explicitly confirm after authentication.
5. Check that users can export/delete their accounts and manage billing even before agreeing to an update.

Records contain the user, document key/version, database timestamp and source. Users can read their records but cannot directly insert, update or delete them. Account deletion cascades records; review this retention choice with the controller. No IP addresses are collected for acceptance.

To publish changed documents, preserve the previous text in Git, change `LEGAL_DOCUMENT_VERSION`, and add a migration updating the version in both acceptance RPCs and the signup trigger. Never overwrite an old acceptance record. The public legal documents and DPIA remain drafts until the proprietor identity, retention schedule and provider arrangements are completed and reviewed.

Analytics preferences remain a separate browser choice. Acknowledging the privacy notice does not opt a student into analytics or establish verified parental consent.
