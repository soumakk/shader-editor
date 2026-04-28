import { FileCode } from "lucide-react";
import { cn } from "../../lib/utils";

export default function FileTab({
  isActive,
  onClick,
  title,
  icon,
  hasIndicator,
}: {
  isActive: boolean;
  onClick: () => void;
  title: string;
  icon: string;
  hasIndicator?: boolean;
}) {
  return (
    <button
      className={cn(
        "relative flex items-center gap-2 text-sm px-4 py-3 transition-colors cursor-pointer",
        isActive
          ? "bg-card text-white"
          : "text-slate-400 hover:bg-popover hover:text-slate-200",
      )}
      onClick={onClick}
    >
      <FileCode size={18} strokeWidth={1.5} />
      {/*<span className="opacity-70">{icon}</span>*/}
      {title}

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-500"></div>
      )}
    </button>
  );
}
