"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Editor() {
  const searchParams = useSearchParams();
  const height: number = Number(searchParams.get("height"));
  const width: number = Number(searchParams.get("width"));
  const [heightState, setHeightState] = useState(height);

  return (
    <div>
      <button
        onClick={() => {
          setHeightState((prev) => prev + 1);
        }}
      >
        +
      </button>
      <h1>Height is : {heightState}</h1>
      <h1>width is : {width}</h1>
      <button
        onClick={() => {
          setHeightState((prev) => prev - 1);
        }}
      >
        -
      </button>
    </div>
  );
}
