import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
  disabled = false,
}: InputSliderProps) {
  return (
    <div className={cn("space-y-4 group", className, disabled && "opacity-50 pointer-events-none")}>
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium text-gray-200 group-hover:text-primary transition-colors">{label}</Label>
        <motion.span 
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono text-primary font-bold bg-primary/10 px-3 py-1 rounded-md border border-primary/20 shadow-[0_0_10px_rgba(0,243,255,0.1)]"
        >
          {value}
        </motion.span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="[&>.relative>.absolute]:bg-primary [&>.relative>.block]:border-primary hover:scale-[1.01] transition-transform cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
