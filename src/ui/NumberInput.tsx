export function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      step={0.01}
      onChange={(e) => onChange(Number(e.target.value))}
      onClick={(e) => e.currentTarget.select()}
      className="flex w-20 py-1 px-2 ring-1 ring-border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-violet-400 bg-background text-foreground"
    />
  );
}
