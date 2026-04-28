import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Pause, Play, Settings } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import {
  modelOptions,
  previewSettingsAtom,
  primitiveAtom,
} from "../../lib/atoms";
import { Checkbox } from "../../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Slider } from "../../ui/slider";
import ShaderMesh from "./ShaderMesh";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import PreviewTopBar from "./PreviewTopBar";

function MetricsTracker({
  fpsRef,
  resRef,
}: {
  fpsRef: React.RefObject<HTMLSpanElement>;
  resRef: React.RefObject<HTMLSpanElement>;
}) {
  const { size } = useThree();
  const frames = useRef(0);
  const prevTime = useRef(performance.now());

  useEffect(() => {
    if (resRef.current)
      resRef.current.innerText = `${Math.round(size.width)} x ${Math.round(size.height)}`;
  }, [size, resRef]);

  useFrame(() => {
    frames.current++;
    const time = performance.now();
    if (time >= prevTime.current + 1000) {
      if (fpsRef.current) fpsRef.current.innerText = `${frames.current} FPS`;
      frames.current = 0;
      prevTime.current = time;
    }
  });
  return null;
}

export default function ShaderPreview({
  fragmentShader,
  vertexShader,
}: {
  fragmentShader: string;
  vertexShader: string;
}) {
  const [settings, setSettings] = useAtom(previewSettingsAtom);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const resRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="flex flex-col bg-background border border-border rounded-xl h-full relative overflow-hidden ml-1">
      <PreviewTopBar />

      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ShaderMesh
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            isPlaying={isPlaying}
            timeScale={timeScale}
            timeDisplayRef={timeDisplayRef}
          />
          <OrbitControls makeDefault enabled autoRotate={settings.autoRotate} />

          <Grid
            infiniteGrid
            fadeDistance={20}
            sectionColor="#334155"
            cellColor="#1e293b"
            position={[0, -1.5, 0]}
            visible={settings.grid}
          />
          <MetricsTracker fpsRef={fpsRef} resRef={resRef} />
        </Canvas>
      </div>

      <div className="flex items-center justify-between p-1.5 bg-background border-t border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-slate-300 hover:text-white cursor-pointer rounded-md bg-card border border-border hover:bg-popover transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <div className="flex items-center gap-3 px-2 ">
            <span className="text-xs text-slate-400">Speed</span>
            <div className="w-32">
              <Slider
                step={0.01}
                max={6}
                value={timeScale}
                onValueChange={(e) => setTimeScale(parseFloat(e))}
              />
            </div>
            <span className="text-xs text-slate-300 font-mono">
              <span ref={timeDisplayRef}>0.00</span>
              <span>s</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border text-slate-400 text-[11px] px-2 py-1 rounded font-mono">
            <span ref={resRef}>0 x 0</span>
          </div>
          <div className="bg-card border border-border text-emerald-400 text-[11px] px-2 py-1 rounded font-mono">
            <span ref={fpsRef}>0 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
