import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "../lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      // Changed to valid data selectors and added 'flex items-center' for vertical alignment
      className={cn(
        "data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full flex items-center",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="center" // Center aligns the thumb directly over the value
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col">
        {/* TRACK: Made it slate-800 for dark mode, bumped height slightly to h-1.5 */}
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-slate-800 select-none data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          {/* INDICATOR (FILL): Changed to purple-500 */}
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-white select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>

        {/* THUMB: White with a purple border, added hover scaling for better UX */}
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-3 shrink-0 rounded-full border-2 border-white bg-white transition-[color,box-shadow,transform] select-none active:scale-125 hover:scale-125 focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-ew-resize active:cursor-ew-resize"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
