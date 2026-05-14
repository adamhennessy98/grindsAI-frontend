import { LogoIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 bg-white">
      <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5 text-gray-500 text-[13px]">
          <LogoIcon size={20} />
          <span>© 2026 GrindsAI · Made in Dublin</span>
        </div>
        <div className="flex gap-6 text-[13px] text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
