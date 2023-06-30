import { SketchPicker } from "react-color";
import { useState } from "react";

export default function Background () {
  const [background, setBackground] = useState('#fff');
  
  const handleBackgroundChange = (color:any) => {
    setBackground(color.rgb);
  }

  return (
    <div className="background-tool-container flex justify-center bg-slate-100 h-1/6 w-full">
      <div>
        {/* <h1 className="text-2xl font-bold">Background</h1> */}
        <SketchPicker
          color={background}
          onChange={handleBackgroundChange}
        />
      </div>
    </div>
  )
}