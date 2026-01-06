import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: InputSliderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium text-gray-200">{label}</Label>
        <span className="font-mono text-primary font-bold bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        className="[&>.relative>.absolute]:bg-primary [&>.relative>.block]:border-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
