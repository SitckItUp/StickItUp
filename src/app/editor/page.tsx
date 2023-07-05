'use client'

import React, { useState } from "react";
import Summary from "../components/Editor/Summary";
import Background from "../components/Editor/Background";
import Material from "../components/Editor/Material";
import Cutline from "../components/Editor/Cutline";
import UploadFile from "../components/Editor/UploadFile";
import Image from 'next/image'


// define interface w/ index signature and value as React.ComponentType<any>
interface ToolComponents {
  [key: string]: React.ComponentType<any>;
}

const toolComponents: ToolComponents = {
  Upload: UploadFile,
  Cutline: Cutline,
  Background: Background,
  Material: Material,
};


// default settings to map to state

// General/Summary Component Settings


// Material Settings
const materialSettings = {
  holo: {
    text: "Holographic Stickers",
    thumbnail: "holo.png",
  },
  mirror: {
    text: "Mirror Stickers",
    thumbnail: "mirror.png",
  },
  glitter: {
    text: "Glitter Stickers",
    thumbnail: "glitter.png",
  },
  glow: {
    text: "Glow in the Dark Stickers",
    thumbnail: "glow.png",
  },
}

// Background Settings

// Editor Component
export default function Editor() {
  
  const [currentTool, setCurrentTool] = useState<React.ReactNode | null>(
  <UploadFile/>
  );

  const icons: React.ReactNode[] = Object.keys(toolComponents).map((el: string) => {
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
    const Component = toolComponents[tool];
    setCurrentTool(<Component />);
  };

  return (
    <div className="flex w-full h-full">
      <div className="editor-pane shadow-inner flex items-center justify-center w-9/12 bg-slate-200">
        <div>Editor

          <Image
            src='../../public/pinterest.png'
            width={500}
            height={500}
            alt="file upload"
          />
        </div>
      </div>
      <div className="tool-column w-2/12 bg-slate-100">
        <h2 className="text-2xl font-bold mb-5"> Custom Stickers </h2>
        <div className="tool-container flex flex-col justify-between h-full">
          {currentTool}
          < Summary />
        </div>
      </div>
      <div className="tool-icons flex flex-col items-center w-1/12 bg-slate-800 text-slate-100">{icons}</div>
    </div>
  );
}
