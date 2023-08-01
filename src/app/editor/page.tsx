"use client";

import React, { useEffect, useRef, useState } from "react";
import Summary from "../components/Editor/Summary";
import Background from "../components/Editor/Background";
import Material from "../components/Editor/Material";
import Cutline from "../components/Editor/Cutline";
import UploadFile from "../components/Editor/UploadFile";
//import Image from "next/image";
import cv from "opencv.js";

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
};

// Background Settings

// Editor Component
export default function Editor(props) {
  const canvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  useEffect(() => {
    const image = new Image();
    //image.src = "https://i.imgur.com/kAYeTy0.png";
    image.src = "https://i.imgur.com/SRrHqHt.png";
    image.setAttribute("crossOrigin", "");

    const resultImage = traceImage(image);
    console.log(resultImage);
  }, []);

  const traceImage = (image) => {
    const traced = (image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(
        image,
        canvas.width / 2 - image.width / 2,
        canvas.height / 2 - image.height / 2
      );
      let src = cv.imread("my_canvas");
      let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4); // Use CV_8UC4 for 4-channel (RGBA) output
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(src, src, 1, 200, cv.THRESH_BINARY);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      // You can try more different parameters
      cv.findContours(
        src,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_NONE
      );
      // draw contours with transparent background
      for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(255, 255, 255, 255); // Use alpha 0 for transparent color
        cv.drawContours(dst, contours, i, color, 35, cv.LINE_8, hierarchy, 100);
      }

      cv.imshow("output_canvas", dst);
      const newImg = new Image();
      const base64Img = outputCanvasRef.current.toDataURL("image/png");
      //console.log(base64Img);
      newImg.src = base64Img;
      src.delete();
      dst.delete();
      contours.delete();
      hierarchy.delete();

      return traceAgain(newImg);
    });

    return traced();
  };

  const traceAgain = (img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(
      img,
      canvas.width / 2 - img.width / 2,
      canvas.height / 2 - img.height / 2
    );
    let src = cv.imread("output_canvas");
    let color = new cv.Scalar(0, 0, 0, 255);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4); // Use CV_8UC4 for 4-channel (RGBA) output
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 1, 200, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    // You can try more different parameters
    cv.findContours(
      src,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_NONE
    );

    console.log("contours.size() is ", contours.size());
    for (let i = 0; i < contours.size(); ++i) {
      // console.log(contours[i][0]);
      console.log('contours.get(0) is ', contours.get(0))
    }
    // draw contours with transparent background
    // for (let i = 0; i < contours.size(); ++i) {
    //   // Use alpha 0 for transparent color
    //   cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    // }

    //Changing parameter to floodfill here
    //Has to be set to black because if it is set to white, potrace does not detect edges
    for (let i = 0; i < contours.size(); ++i) {
      cv.drawContours(
        dst,
        contours,
        i,
        color,
        cv.FILLED,
        cv.LINE_8,
        hierarchy,
        0
      );
    }

    cv.imshow("output_canvas", dst);

    //Draw original image over outline
    // const outputCanvas = outputCanvasRef.current;
    // const outputContext = outputCanvas.getContext("2d");
    // outputContext.drawImage(
    //   originalImg,
    //   outputCanvas.width / 2 - originalImg.width / 2,
    //   outputCanvas.height / 2 - originalImg.height / 2
    // );
    //const newImg = new Image();
    const base64Img = outputCanvasRef.current.toDataURL("image/png");
    //console.log(base64Img);
    // src.delete();
    // dst.delete();
    // contours.delete();
    // hierarchy.delete();
  };

  function sendToPotrace(base64Img) {
    fetch("http://localhost:3000/api/potrace", {
      method: "POST",
      body: JSON.stringify({ image: base64Img }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  const [currentTool, setCurrentTool] = useState<React.ReactNode | null>(
    <UploadFile />
  );

  const icons: React.ReactNode[] = Object.keys(toolComponents).map(
    (el: string) => {
      return (
        <div
          key={el}
          className="flex items-center justify-center w-full h-20 hover:bg-slate-600 hover:cursor-pointer"
          onClick={() => handleToolChange(el)}
        >
          <span className="text-center">{el}</span>
        </div>
      );
    }
  );

  const handleToolChange = (tool: string) => {
    const Component = toolComponents[tool];
    setCurrentTool(<Component />);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex items-center justify-center w-9/12 shadow-inner editor-pane bg-slate-200">
        <div>
          {/* Editor */}
          {/* <Image
            src="https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/13/ceec02f4961a5e0b68fed03b4f9c72f42e638811.png"
            width={500}
            height={500}
            alt="file upload"
          /> */}
          <canvas
            id="my_canvas"
            ref={canvasRef}
            {...props}
            width={700}
            height={700}
          />
          <canvas
            id="output_canvas"
            ref={outputCanvasRef}
            {...props}
            width={700}
            height={700}
            // style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          />
        </div>
      </div>
      <div className="w-2/12 tool-column bg-slate-100">
        <h2 className="mb-5 text-2xl font-bold"> Custom Stickers </h2>
        <div className="flex flex-col justify-between h-full tool-container">
          {currentTool}
          <Summary />
        </div>
      </div>
      <div className="flex flex-col items-center w-1/12 tool-icons bg-slate-800 text-slate-100">
        {icons}
      </div>
    </div>
  );
}
