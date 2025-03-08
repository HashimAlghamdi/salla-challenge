import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import Loader from "./Loader";

interface QuantityControlsProps {
  quantity: number;
  onUpdate: (quantity: number) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

const QuantityControls = ({
  quantity,
  onUpdate,
  onDelete,
  isLoading,
}: QuantityControlsProps) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const debouncedUpdate = React.useCallback(
    debounce((value: number) => {
      onUpdate(value);
    }, 800),
    [onUpdate]
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center p-2 border border-gray-200 rounded-lg">
          <div className="w-[120px] flex items-center justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center p-2 border border-gray-200 rounded-lg">
        <button
          onClick={() => onUpdate(quantity + 1)}
          className="px-2 text-gray-500"
          disabled={isLoading}
        >
          +
        </button>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
              debouncedUpdate(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = parseInt(inputValue);
              if (!isNaN(value) && value > 0) {
                onUpdate(value);
                e.currentTarget.blur();
              }
            }
          }}
          className="w-[50px] text-center appearance-none bg-transparent"
        />
        <button
          onClick={() => onUpdate(quantity - 1)}
          className="px-2 text-gray-500"
          disabled={isLoading || quantity <= 1}
        >
          -
        </button>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="w-[42px] h-[42px] flex items-center justify-center text-sm border border-red-500 text-red-500 rounded-full disabled:opacity-50"
        >
          <i className="sicon-trash text-lg" />
        </button>
      )}
    </div>
  );
};

export default QuantityControls;
