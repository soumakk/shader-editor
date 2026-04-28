import { useAtom } from "jotai";
import { Settings } from "lucide-react";
import {
  previewSettingsAtom,
  primitiveAtom,
  modelOptions,
} from "../../lib/atoms";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";

export default function PreviewTopBar() {
  const [settings, setSettings] = useAtom(previewSettingsAtom);
  const [activePrimitive, setActivePrimitive] = useAtom(primitiveAtom);

  return (
    <div className="p-1.5 flex items-center justify-between bg-background border-b border-border">
      <Select
        value={activePrimitive}
        onValueChange={(value) => setActivePrimitive(value as string)}
      >
        <SelectTrigger
          size="sm"
          className="capitalize rounded-md flex text-xs items-center gap-2 bg-popover text-slate-300 hover:text-white px-2 py-1 hover:bg-popover border border-border cursor-pointer transition-colors"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="w-32 bg-popover border-border text-slate-200"
        >
          <SelectGroup>
            {modelOptions?.map((m) => (
              <SelectItem
                key={m.value}
                value={m.value}
                className="cursor-pointer hover:bg-hover hover:text-white text-xs py-1"
              >
                {m.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger
          render={
            <button className="p-1 text-slate-300 hover:text-white cursor-pointer rounded-md bg-card border border-border hover:bg-popover transition-colors">
              <Settings size={16} />
            </button>
          }
        ></PopoverTrigger>
        <PopoverContent align="end" className="w-40 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-slate-300 text-xs cursor-pointer">
            <Checkbox
              checked={settings.grid}
              onCheckedChange={(value) =>
                setSettings((s) => ({ ...s, grid: !!value }))
              }
            />
            Grid
          </label>
          <label className="flex items-center gap-2 text-slate-300 text-xs cursor-pointer">
            <Checkbox
              checked={settings.wireframe}
              onCheckedChange={(value) =>
                setSettings((s) => ({ ...s, wireframe: !!value }))
              }
            />
            Wireframe
          </label>
          <label className="flex items-center gap-2 text-slate-300 text-xs cursor-pointer">
            <Checkbox
              checked={settings.autoRotate}
              onCheckedChange={(value) =>
                setSettings((s) => ({ ...s, autoRotate: !!value }))
              }
            />
            Auto Rotate
          </label>
        </PopoverContent>
      </Popover>
    </div>
  );
}
