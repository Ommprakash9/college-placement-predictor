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
  disabled?: boolean;
}

export function InputNumber({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  className,
  disabled = false,
}: InputNumberProps) {
  const handleDecrement = () => {
    if (value > min && !disabled) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max && !disabled) onChange(value + 1);
  };

  return (
    <div className={cn("space-y-4 group", className, disabled && "opacity-50 pointer-events-none")}>
      <Label className="text-base font-medium text-gray-200 group-hover:text-secondary transition-colors">{label}</Label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min || disabled}
          className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        
        <div className="flex-1 relative">
          <Input
            type="number"
            value={value}
            disabled={disabled}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= min && val <= max) onChange(val);
            }}
            className="text-center font-mono font-bold bg-background/50 border-input focus:border-secondary focus:ring-secondary/20 transition-all hover:border-secondary/50"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max || disabled}
          className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 hover:border-secondary transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
