import Link from "next/link";
import { BrandLogo } from "@/components/icons";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="mb-8 inline-flex items-center" aria-label="GrindsAI home">
        <BrandLogo height={42} />
      </Link>
      <h1 className="text-xl font-semibold m-0">Sign-in link expired</h1>
      <p className="mt-2 text-gray-500 max-w-md">
        Try signing in again. If you used Google or email magic link, request a fresh link from the login page.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
      >
        Back to login
      </Link>
    </div>
  );
}
