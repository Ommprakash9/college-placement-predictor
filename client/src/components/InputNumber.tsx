import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface InputNumberProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function InputNumber({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  className,
}: InputNumberProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-base font-medium text-gray-200">{label}</Label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        
        <div className="flex-1 relative">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= min && val <= max) onChange(val);
            }}
            className="text-center font-mono font-bold bg-background/50 border-input focus:border-primary focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
