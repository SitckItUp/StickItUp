'use client'

import { useState } from "react";
import Summary from "../components/Editor/Summary";
import Background from "../components/Editor/Background";
import Material from "../components/Editor/Material";
import Outline from "../components/Editor/Outline";
import UploadFile from "../components/Editor/UploadFile";

export default function Editor() {
  
  const [currentTool, setCurrentTool] = useState<React.ReactNode | null>(<UploadFile/>);

  const icons: React.ReactNode[] = [
    "Upload",
    "Outline",
    "Background",
    "Material",
  ].map((el: string) => {
    return (
      <div
        key={el}
        className="flex items-center justify-center w-full h-20 hover:bg-slate-600 hover:cursor-pointer"
        onClick={() => handleToolChange(el)}
      >
        <span className="text-center">{el}</span>
      </div>
    );
  });

  const handleToolChange = (tool: string) => {
    switch (tool) {
      case "Upload":
        setCurrentTool(<UploadFile />);
        break;
      case "Outline":
        setCurrentTool(<Outline />);
        break;
      case "Background":
        setCurrentTool(<Background />);
        break;
      case "Material":
        setCurrentTool(<Material />);
        break;
      default:
        setCurrentTool(null);
        break;
    }
  };

  return (
    <div className="flex w-full h-full rounded">
      <div className="shadow-inner flex items-center justify-center w-9/12 bg-slate-200">
        <div>Editor</div>
      </div>
      <div className="tool-container flex flex-col justify-between w-2/12 bg-slate-100">
        {currentTool}
        < Summary />
      </div>
      <div className="flex flex-col items-center w-1/12 bg-slate-800">{icons}</div>
    </div>
  );
}
