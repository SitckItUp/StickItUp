"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Summary from "../../components/Editor/Summary";
import Background from "../../components/Editor/Background";
import Material from "../../components/Editor/Material";
import Cutline from "../../components/Editor/Cutline";
import UploadFile from "../../components/Editor/UploadFile";
//import Image from "next/image";
import cv from "opencv.js";
import { split } from "postcss/lib/list";


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

export default function Editor({ params }: { params: { slug: string[] } }, props) {
  const canvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const [tracedSVG, setTracedSVG] = useState(null);
  const svgRef = useRef(null);
  const [tracedSVGWidth, setTracedSVGWidth] = useState(null);
  const [bgColor, setBgColor] = useState("#fff");
  const [svgPath, setSVGPath] = useState<null | string>();

  const [currentTool, setCurrentTool] = useState<React.ReactNode | null>(
    <UploadFile />
  );
  
  // searchParams is for url segments that look like '?a=10&b=20'
  // can grab a value via searchParams.get('a');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  //params.slug contains all url segments after our endpoint as str elements
  //for the url endpoint /editor/1/2/3 params.slug will be an array of [1,2,3]
  const [slug, setSlug] = useState<number[]>(params.slug.map(el=>Number(el)));

  // //checks to see if url is as expected
  // if(slug.length !== 3 || slug.some(el=>isNaN(el))){
  //   // throw new Error("Incorrect path");
  //   // return;
  // }
  // function onChange (s:number,ind:number){
  //   setSlug((prev)=>{
  //     const newArr = prev.slice();
  //     newArr.splice(ind,1,s)
  //     return newArr;
  //   })
  // }

  // useEffect(()=>{
  //   router.push(`/editor/${slug[0]}/${slug[1]}/${slug[2]}`);
  // },[slug])

  useEffect(() => {
    const image = new Image();
    image.src = "https://i.imgur.com/kAYeTy0.png";
    //image.src = "https://i.imgur.com/SRrHqHt.png";

    image.setAttribute("crossOrigin", "");

    const resultImage = traceImage(image);
    console.log(resultImage);
  }, []);


  useEffect(() => {
    if (svgRef.current) {
      // Access the container element using the ref
      const containerElement = svgRef.current;
      // Update fill and border attributes based on bgColor
      containerElement.querySelector("path").setAttribute("fill", bgColor);
      containerElement.querySelector("path").setAttribute("border", "#000");
      // Apply max-w-full and h-auto classes based on tracedSVG
      containerElement
        .querySelector("svg")
        .classList.add("max-w-full", "h-auto");
    }
  }, [bgColor, tracedSVG, currentTool]);

  const updateTracedSVGWidth = (el: React.El) => {};

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

    //create SVG from contours
    // const contoursArr = [];
    // for (let i = 0; i < contours.get(0).data32S.length; ++i) {
    //   console.log()
    //   console.log('contours.get(0).data32S[i] is ', contours.get(0).data32S[i])
    // }

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
    sendToPotrace(base64Img);
  };

  const createSVG = (contours) => {};

  function sendToPotrace(base64Img) {
    fetch("http://localhost:3000/api/potrace", {
      method: "POST",
      body: JSON.stringify({ image: base64Img }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const splitPath = data.split('"');
        //console.log(splitPath[11]);
        setSVGPath(splitPath[11]);
        setTracedSVG(data);
      });
  }

  function expandCutLine(size: string) {
    //Set the ratio to expand the SVG by
    //Currently only sets medium and large cutlines, small should default to original size
    //but gets overwritten
    const amountToIncrease = size === "medium" ? 0.15 : 0.3;

    //Check to see if we have a path to perform the expansion
    if (svgPath) {
      //Split the path by white space
      const splitPath = svgPath.split(" ");
      //console.log(splitPath);
      //Loop through each point in the path
      for (let i = 0; i < splitPath.length; i++) {
        //console.log(point);
        //Set a flag to check if the current point has a comma at the end of the point,
        // if so we'll remove it and tack it back on later
        let hasComma = false;
        //check if last char is a comma
        if (splitPath[i][splitPath[i].length - 1] === ",") {
          hasComma = true;
          //Set the current point with the comma removed
          splitPath[i] = splitPath[i].substring(0, splitPath[i].length - 1);
        }

        //Point is currently a string, cast the string to a number
        //We want a number because we want to only expand on the numbers
        //and not the C, L, etc of a SVG path element
        let convertedPoint = Number(splitPath[i]);

        //Check to see if current point is a number if not ignore
        if (!isNaN(convertedPoint)) {
          //Check to see if the point is supposed to have a comma
          //Increase the current point by a factor and if there was supposed to be a comma,
          //tack it on, otherwise leave it
          splitPath[i] = hasComma
            ? String(
                (convertedPoint + amountToIncrease * convertedPoint).toFixed(3)
              ) + ","
            : String(
                (convertedPoint + amountToIncrease * convertedPoint).toFixed(3)
              );
        }
      }
      // console.log(splitPath);
      //Join the expanded path array back into an actual path
      const expandedPath = splitPath.join(" ");
      //Take the entire SVG string and replace the old path with the new path
      const newSVG = tracedSVG.replace(
        /<path d="([^"]+)"/,
        `<path d="${expandedPath}"`
      );

      //set state to new path
      setTracedSVG(newSVG);
    }
  }

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
    setCurrentTool(
      <Component
        bgColor={bgColor}
        setBgColor={setBgColor}
        expandCutLine={expandCutLine}
      />
    );
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <div className="flex items-center justify-center h-full lg:w-9/12 shadow-inner editor-pane bg-slate-200">
        <div className="relative w-full h-full">
          {/* Editor */}
          {/* <Image
            src="https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/13/ceec02f4961a5e0b68fed03b4f9c72f42e638811.png"
            width={500}
            height={500}
            alt="file upload"
          /> */}
          <div className={!tracedSVG ? "invisible" : "visible"}>
            <canvas
              className="topdiv absolute top-0 left-0 z-10 max-w-full"
              id="my_canvas"
              ref={canvasRef}
              {...props}
              width={700}
              height={700}
            />

            {!tracedSVG && (
              <canvas
                className="output-canvas absolute top-0 left-0 max-w-full"
                id="output_canvas"
                ref={outputCanvasRef}
                {...props}
                width={700}
                height={700}
              />
            )}
            {tracedSVG && (
              <div
                className="backg-svg absolute top-0 left-0 max-w-full drop-shadow-xl"
                ref={svgRef}
                dangerouslySetInnerHTML={{ __html: tracedSVG }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="lg:w-72 lg:min-w-72 lg:relative lg:bottom-0 lg:h-full h-60 absolute bottom-20 w-full tool-column bg-slate-100">
        <h2 className="mb-5 text-2xl font-bold"> Custom Stickers </h2>
        <div className="flex lg:flex-col justify-between lg:h-full lg:w-72 tool-container">
          {currentTool}
          <Summary />
        </div>
      </div>
      <div className="flex lg:flex-col lg:items-center lg:w-24 lg:relative absolute bottom-0 w-full tool-icons bg-slate-800 text-slate-100">
        {icons}
      </div>
       {/* <div>
        <h1>Height is : {slug[0]}</h1>
        <input type="range" min="0" max="100" value={slug[0]} onChange={(e)=>onChange(Number(e.target.value),0)}/>
        <h1>Width is : {slug[1]} </h1>
        <input type="range" min="0" max="100" value={slug[1]} onChange={(e)=>onChange(Number(e.target.value),1)}/>
        <h1>Quantity is : {slug[2]}</h1>
        <input type="range" min="0" max="100" value={slug[2]} onChange={(e)=>onChange(Number(e.target.value),2)}/>
      </div> */}
    </div>


     
  );
}
