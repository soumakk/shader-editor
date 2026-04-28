import { useAtom } from "jotai";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { customUniformsAtom, UniformType } from "../../lib/atoms";
import useCopyToClipboard from "../../lib/useCopy";
import { NumberInput } from "../../ui/NumberInput";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

export default function UniformsPanel() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [uniforms, setUniforms] = useAtom(customUniformsAtom);

  // State for the Add form
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<UniformType>("float");

  const handleAdd = () => {
    if (!newName) return;

    let defaultValue: any = 0.0;
    if (newType === "vec2") defaultValue = [0.0, 0.0];
    if (newType === "vec3") defaultValue = [0.0, 0.0, 0.0];

    setUniforms([
      ...uniforms,
      {
        id: Math.random().toString(36).substring(7),
        name: newName,
        type: newType,
        value: defaultValue,
      },
    ]);

    // Reset form and close popover
    setNewName("");
    setNewType("float");
    setIsPopoverOpen(false);
  };

  const removeUniform = (id: string) => {
    setUniforms(uniforms.filter((u) => u.id !== id));
  };

  const updateValue = (id: string, newValue: any) => {
    setUniforms(
      uniforms.map((u) => (u.id === id ? { ...u, value: newValue } : u)),
    );
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-xl overflow-hidden mr-1">
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-border ">
        <span className="text-sm font-medium text-slate-200 ">Uniforms</span>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger
            render={
              <button className="flex items-center gap-1 bg-card border border-border text-slate-300 hover:text-white px-2 py-1.5 text-xs rounded-lg hover:bg-popover transition-colors cursor-pointer">
                <Plus size={12} /> Add
              </button>
            }
          ></PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-56 bg-popover border-slate-700 p-3 rounded-lg shadow-xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
              className="space-y-3"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Name
                </label>
                <input
                  value={newName}
                  placeholder="u_name"
                  onChange={(e) => setNewName(e.target.value)}
                  className=" border border-border text-sm text-slate-200 px-2 py-1.5 rounded-md outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as UniformType)}
                  className=" bg-popover border border-border text-sm text-slate-200 px-2 py-1.5 rounded-md outline-none focus:border-violet-500"
                >
                  <option value="float">float</option>
                  <option value="vec2">vec2</option>
                  <option value="vec3">vec3</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white text-sm py-1.5 rounded-md transition-colors font-medium mt-1 cursor-pointer"
              >
                Create
              </button>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 overflow-y-auto ">
        {uniforms.map((u) => (
          <div
            key={u.id}
            className="flex flex-col gap-2 group p-3 border-b border-border"
          >
            {/* LABEL ROW */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-200 font-mono">
                  {u.name}
                </span>
                <span className="text-xs text-slate-500 bg-popover px-1.5 py-0.5 rounded tracking-wider font-medium">
                  {u.type}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    copyToClipboard(`uniform ${u.type} ${u.name};`);
                  }}
                  className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isCopied ? (
                    <Check className="text-green-500" size={14} />
                  ) : (
                    <Copy className="text-slate-500" size={14} />
                  )}
                </button>
                <button
                  onClick={() => removeUniform(u.id)}
                  className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* INPUT ROWS */}
            {u.type === "float" && (
              <NumberInput
                value={u.value}
                onChange={(v) => updateValue(u.id, v)}
              />
            )}

            {u.type === "vec2" && (
              <div className="flex gap-2 w-full">
                <NumberInput
                  value={u.value[0]}
                  onChange={(v) => updateValue(u.id, [v, u.value[1]])}
                />
                <NumberInput
                  value={u.value[1]}
                  onChange={(v) => updateValue(u.id, [u.value[0], v])}
                />
              </div>
            )}

            {u.type === "vec3" && (
              <div className="flex gap-2 w-full">
                <NumberInput
                  value={u.value[0]}
                  onChange={(v) =>
                    updateValue(u.id, [v, u.value[1], u.value[2]])
                  }
                />
                <NumberInput
                  value={u.value[1]}
                  onChange={(v) =>
                    updateValue(u.id, [u.value[0], v, u.value[2]])
                  }
                />
                <NumberInput
                  value={u.value[2]}
                  onChange={(v) =>
                    updateValue(u.id, [u.value[0], u.value[1], v])
                  }
                />
              </div>
            )}
          </div>
        ))}

        {uniforms.length === 0 && (
          <div className="text-center text-xs text-slate-500 mt-8 px-4">
            No custom uniforms. Click Add to create one.
          </div>
        )}
      </div>
    </div>
  );
}
