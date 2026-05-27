/** When true, UI presents GrindsAI as a free LC beta — not a paid product. Set NEXT_PUBLIC_BETA_MODE=false to restore launch UI. */
export const IS_BETA = process.env.NEXT_PUBLIC_BETA_MODE !== "false";

export const BETA_FEEDBACK_EMAIL = "hello@grindsai.ie";
