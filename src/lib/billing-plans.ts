export const BILLING_PLAN_IDS = ["individual", "seven", "unlimited"] as const;

export type BillingPlanId = (typeof BILLING_PLAN_IDS)[number];

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  priceLabel: string;
  detail: string;
  cta: string;
  maxSubjects: number | null;
};

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  individual: {
    id: "individual",
    name: "Individual subjects",
    priceLabel: "€10",
    detail: "Your first subject is €10/month. Add up to three further subjects for €5/month each.",
    cta: "Choose subjects",
    maxSubjects: 4,
  },
  seven: {
    id: "seven",
    name: "Up to 7 subjects",
    priceLabel: "€25",
    detail: "One monthly price for up to seven Leaving Cert subjects.",
    cta: "Choose this plan",
    maxSubjects: 7,
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited subjects",
    priceLabel: "€30",
    detail: "Every subject you study, with room to add more when you need to.",
    cta: "Go unlimited",
    maxSubjects: null,
  },
};

export const BILLING_PLAN_LIST = BILLING_PLAN_IDS.map((id) => BILLING_PLANS[id]);

export function isBillingPlanId(value: unknown): value is BillingPlanId {
  return typeof value === "string" && BILLING_PLAN_IDS.includes(value as BillingPlanId);
}

export function planSupportsSubjectCount(planId: BillingPlanId, subjectCount: number): boolean {
  const limit = BILLING_PLANS[planId].maxSubjects;
  return limit === null || subjectCount <= limit;
}
