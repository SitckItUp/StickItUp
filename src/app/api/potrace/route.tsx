import { NextRequest as Request, NextResponse } from "next/server";
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");

const options = {
  threshold: 30,
  steps: 10,
  alphaMax: 100,
  optTolerance: 10,
  optCurve: true,
};

export async function POST(request: Request) {
  //console.log(request)
  if (!request) {
    console.error("Request object is undefined or null");
    return;
  }

  //Grab image as base64 data from client
  const body = await request.json();
  //Destructure the image object from body
  const { image } = body;
  //Remove leading string that we dont need
  const base64Data = image.replace(/^data:image\/png;base64,/, "");
  //Convert into data array
  const imageBuffer = Buffer.from(base64Data, "base64");
  //Write the image data array back into a PNG file
  fs.writeFileSync("image.png", imageBuffer);
  //Grab image path from root of project directory
  const savedImage = path.join(__dirname, "../../../../../image.png");
  //Trace the saved image and output into new_output.svg
  //and send response back to client
  try {
    // Wrap potrace.trace in a Promise for async/await usage
    const svg = await new Promise((resolve, reject) => {
      potrace.trace(savedImage, options, function (err, svg) {
        if (err) {
          reject(err);
        } else {
          resolve(svg);
        }
      });
    });

    // Write the SVG to a file (optional)
    fs.writeFileSync("./new_output4.svg", svg);
    // Respond with the SVG string
    return new NextResponse(JSON.stringify(svg), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (error) {
    console.error("Error generating SVG:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
