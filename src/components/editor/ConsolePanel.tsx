import { useAtom } from "jotai";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { errorsAtom } from "../../lib/atoms";

export default function ConsolePanel() {
  // Use the global atom instead of local state
  const [errors, setErrors] = useAtom(errorsAtom);

  return (
    <div className="flex flex-col h-40 bg-[#0d0f17] border border-white/10 rounded-lg overflow-hidden mr-1 ">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0d0f17] px-4 py-2">
        <span className="text-sm font-medium text-slate-200">Console</span>
        <button
          onClick={() => setErrors([])}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white px-3 py-1 text-xs border border-slate-700 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* LOG CONTENT */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-sm ">
        {errors.length === 0 ? (
          /* SUCCESS STATE */
          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-950/50 p-1 px-2 rounded-sm">
            <CheckCircle2 size={14} />
            <span>Shader compiled successfully</span>
          </div>
        ) : (
          /* ERROR STATE */
          <div className="space-y-1">
            {errors.map((error) => (
              <div
                key={error.id}
                className="flex items-start gap-2 group bg-rose-950/50 p-1 px-2 rounded-sm"
              >
                <XCircle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                <span className="text-rose-500 whitespace-nowrap">
                  ERROR at {error.line} :{" "}
                </span>
                <div className="flex flex-col">
                  <span className="text-rose-500">{error.message}</span>
                  {/*{error.snippet && (
                    <div className="mt-1 ml-4 text-slate-300">
                      <div className="flex">
                        <span className="text-slate-500 w-6 text-right mr-2">
                          {error.line} |
                        </span>
                        <span>{error.snippet}</span>
                      </div>
                      <div className="ml-[2rem] text-rose-400">^</div>
                    </div>
                  )}*/}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
