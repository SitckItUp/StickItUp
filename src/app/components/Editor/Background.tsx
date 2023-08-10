'use client';
import { SketchPicker } from "react-color";
import { useState } from "react";

interface BackgroundProps {
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function Background({ bgColor, setBgColor }: BackgroundProps) {
  const [background, setBackground] = useState("#fff");

  //console.log(bgColor);
  const handleBackgroundChange = (color: any) => {
    setBackground(color.hex);
    setBgColor(color.hex);
  };

  return (
    <div className="flex justify-center w-full background-tool-container bg-slate-100 h-1/6">
      <div>
        {/* <h1 className="text-2xl font-bold">Background</h1> */}
        <SketchPicker color={background} onChange={handleBackgroundChange} />
      </div>
    </div>
  );
}
