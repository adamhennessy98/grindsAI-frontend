# GrindsAI Data Protection Impact Assessment (DPIA) draft

**Status:** Internal working draft. Not a completed DPIA, legal advice, or a public policy.

**Owner:** GrindsAI sole trader (legal name to be inserted before launch)  
**Project:** GrindsAI web study workspace and AI-assisted Leaving Certificate tutoring  
**Jurisdiction:** Ireland / EU GDPR  
**Last reviewed:** 29 August 2026  
**Next review:** Before public paid launch, then at least annually and before any material processing change.

## 1. Decision and launch gate

This DPIA must be completed and approved by the controller, with independent Irish data-protection advice, before public launch. It is required to remain a living document because the product processes educational activity about teenagers and uses AI-assisted personalisation.

**Do not launch the following until the items are evidenced:**

- controller legal name, trading details and correspondence address;
- complete record of processing activities and retention schedule;
- signed processor agreements and sub-processor inventory;
- documented assessment of every non-EEA transfer and relevant safeguards;
- final lawful-basis assessment, including the under-18 / parent-or-guardian model;
- production consent/version records;
- security testing, incident response and data-subject-rights procedures;
- confirmed deletion and backup-deletion testing;
- formal risk review and sign-off.

## 2. Processing overview

GrindsAI provides a student account, selected Leaving Certificate subjects and levels, topic-aware Tutor conversations, generated study questions, Topic Checks, progress records, subscriptions and account controls. It may retain selected study context so future support is relevant to the student.

The likely data subjects are students aged approximately 15–19, parents/guardians who purchase or contact the service, and website visitors. Children and young people are treated as vulnerable data subjects for risk assessment.

## 3. Information flows

| Stage | Personal data | Purpose | Recipients / systems |
| --- | --- | --- | --- |
| Visitor | cookie choice, limited technical/log data | provide and secure public site; optional analytics | hosting; Google Analytics only with consent |
| Sign-up | email, authentication identifiers | create and secure account | Supabase authentication |
| Study profile | year group, selected subjects, levels, learning preferences | configure subject-aware workspace | Supabase |
| Tutor / learning activity | prompts, answers, focus areas, topic and study history | provide Tutor, questions, Topic Checks and relevant support | Supabase; Anthropic; optional OpenAI retrieval embeddings |
| Subscription | email, customer/subscription identifiers, plan status | process billing and control access | Stripe; Supabase |
| Support / privacy request | contact details and correspondence | respond and comply with legal obligations | approved support/contact systems |

**Out of scope by design:** GrindsAI should not request health, counselling, criminal, biometric, precise location or other special-category data. Product UI and prompts should discourage users from submitting unnecessary sensitive information.

## 4. Necessity and proportionality assessment

- Account identity is needed to maintain a private workspace, secure access and support deletion/export requests.
- Subject, level, topic and study activity are needed for context-aware educational support. Do not collect more profile information than is needed for that purpose.
- Tutor prompts and answers should be minimised, access-controlled and retained only under the approved schedule.
- Payment card details must remain with the payment provider; GrindsAI should receive only identifiers and subscription status needed to provide the plan.
- Optional analytics must remain off until a valid choice is recorded and must not be necessary for account use.
- AI providers must be configured and contracted so customer content is not used for provider training unless an explicit, lawful, separately reviewed arrangement says otherwise.

## 5. Lawful bases to validate

| Processing | Proposed basis | Validation required |
| --- | --- | --- |
| Account, workspace, Tutor and subscription delivery | Contract | confirm the user / parent contracting model for under-18s |
| Security, fraud prevention and service reliability | Legitimate interests and/or legal obligation | document balancing test, controls and retention |
| Optional analytics | Consent | consent mechanism, records, withdrawal and vendor configuration |
| Marketing, if added | Consent or other lawful basis after advice | separate opt-in; never derive from study content |
| Tax/accounting records | Legal obligation | confirm statutory retention periods |

## 6. Key risks and controls

| Risk | Initial rating | Required controls | Residual rating / owner |
| --- | --- | --- | --- |
| Teen shares sensitive or overly personal information in Tutor | High | child-oriented notices, prompt filtering/guardrails, minimise collection, clear reporting/support path, retention limits | assess before launch / product owner |
| Unauthorised account access | High | Supabase security configuration, MFA assessment, breached-password protection, rate limits, secure cookies, audit logs, secure password reset | assess before launch / technical owner |
| AI response is unsafe, misleading or overly confident | High | study-only scope, clear disclaimers, teacher review process, output monitoring, incident route, no high-impact automated decisions | assess before launch / content owner |
| Provider or cross-border transfer misuse | High | processor terms, sub-processor inventory, transfer impact assessment, SCCs/adequacy review, data minimisation | assess before launch / controller |
| Excessive retention or undeleted backups | Medium/High | approved retention schedule, deletion workflow, backup lifecycle, periodic deletion tests | assess before launch / technical owner |
| Profiling makes a student feel monitored or disadvantages them | High | explain personalisation, minimise profile, no grade/admission decisions, user controls, test for unfair outcomes | assess before launch / product owner |
| Subscription information or parent contact misused | Medium | Stripe-hosted payment, least privilege, separate finance retention, no card storage | assess before launch / finance owner |
| Data-subject request or breach handled poorly | High | documented DSAR and incident response playbooks, owner, deadline tracking, breach assessment procedure | assess before launch / controller |

## 7. Children and young people

- Use short, direct notices at the point of collection, supported by a fuller privacy policy.
- Do not rely on confusing consent language or dark patterns.
- Decide and document the age-verification and parent/guardian approach before launch.
- Keep product defaults protective: no behavioural advertising, no public profiles, no sharing of study content, no unnecessary tracking.
- Obtain and record advice on the Irish legal position for consent and contracts involving minors.

## 8. Processors, security and transfers checklist

- [ ] Confirm final hosting provider and data locations.
- [ ] Execute and record Supabase DPA, regional settings and sub-processors.
- [ ] Execute and record Anthropic terms/DPA, retention configuration and transfer assessment.
- [ ] Execute and record OpenAI terms/DPA if vector retrieval is enabled.
- [ ] Execute and record Stripe DPA, PCI scope and customer-portal settings.
- [ ] Confirm Google Analytics consent mode, IP/settings, retention and DPA if enabled.
- [ ] Set least-privilege production access, secrets management, logging and monitoring.
- [ ] Complete penetration/security testing and dependency patch process.
- [ ] Test exports, deletion, access revocation and backup deletion.

## 9. Consultation, sign-off and review

Record consultation with students/parents or representatives where appropriate, engineering, content/teacher reviewers and legal/privacy advisers. Document any decision not to take a recommendation.

| Role | Name | Decision / comments | Date |
| --- | --- | --- | --- |
| Controller / sole trader | _To complete_ |  |  |
| Irish privacy adviser | _To complete_ |  |  |
| Security / technical reviewer | _To complete_ |  |  |
| Teacher/content reviewer | _To complete_ |  |  |

If residual high risk remains and cannot be mitigated, obtain specialist advice on whether prior consultation with the Irish Data Protection Commission is required before processing.

## 10. Source material

- Irish Data Protection Commission, [Children Front and Centre / child-oriented processing](https://www.dataprotection.ie/en/dpc-guidance/fundamentals-child-oriented-approach-data-processing)
- Irish Data Protection Commission, [Data Protection Impact Assessments](https://www.dataprotection.ie/en/organisations/know-your-obligations/data-protection-impact-assessments)
- Irish Data Protection Commission, [AI, Large Language Models and Data Protection](https://www.dataprotection.ie/en/dpc-guidance/blogs/AI-LLMs-and-Data-Protection)
- CCPC, [Buying digital content and services](https://www.ccpc.ie/consumer-advice/consumer-rights/buying-services/buying-digital-content-and-services)
