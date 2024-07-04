"use client";
import { useRef } from "react";
import { CustomInputNumberProps } from "@/types";
import "@/assets/scss/index.scss";

export const CustomInputNumber = (props: CustomInputNumberProps) => {
  const { min, max, step, name, value, disabled, onChange, onBlur } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const getContentStyle = (): string => {
    let result = "text-base space-x-2 p-2 ";

    if (disabled) {
      result += "opacity-30";
    }

    return result;
  };

  // TODO onChange 待修正
  const toggleValue = (isPlus = false) => {
    if (inputRef.current && !disabled) {
      const changeValue = isPlus
        ? `${Number(value) + step}`
        : `${Number(value) - step}`;
      inputRef.current.value = changeValue;
    }
  };

  return (
    <div
      className={getContentStyle()}
      onClick={(e) => {
        if (e.target !== inputRef.current) {
          inputRef.current?.focus();
          inputRef.current?.blur();
        }
      }}
    >
      <button
        disabled={Number(value) <= min}
        className="h-12 w-12 border border-blue-500"
        onBlur={(e) => {
          e.stopPropagation();
        }}
        onClick={() => toggleValue()}
      >
        -
      </button>
      <input
        ref={inputRef}
        name={name}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        type="number"
        className="h-12 w-12 border border-blue-500 bg-transparent text-center"
        onChange={(e) => {
          onChange && onChange(e);
        }}
        onBlur={(e) => {
          onBlur && onBlur(e);
        }}
      />
      <button
        disabled={max <= Number(value)}
        className="h-12 w-12 border border-blue-500"
        onBlur={(e) => {
          e.stopPropagation();
        }}
        onClick={() => toggleValue(true)}
      >
        +
      </button>
    </div>
  );
};
