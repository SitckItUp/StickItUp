import { NextRequest as Request, NextResponse } from "next/server";
const potrace = require("potrace");
const fs = require("fs");

const options = {
  threshold: 30,
  steps: 10,
  alphaMax: 100,
  optTolerance: 10,
};

export async function POST(request: Request) {
  //console.log(request)
  if (!request) {
    console.error("Request object is undefined or null");
    return;
  }

  const body = await request.json();
  const { image } = body;
  //console.log("body", body);
  //console.log(image);

  const imageBuffer = Buffer.from(image, "base64");

  fs.writeFileSync("image.png", imageBuffer);

  potrace.trace(
    // "https://i.imgur.com/0QmN09K.png",
    "https://i.imgur.com/RUeUuoD.png",
    options,
    function (err, svg) {
      if (err) throw err;
      console.log("start tracing");
      //console.log(svg);
      fs.writeFileSync("./new_output4.svg", svg);
    }
  );

  // potrace.posterize("https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/13/ceec02f4961a5e0b68fed03b4f9c72f42e638811.png", options, function (err, svg) {
  //     if (err) throw err;
  //     console.log('start tracing');
  //     console.log(svg)
  //     fs.writeFileSync('./posterized_output.svg', svg);
  // })

  return NextResponse.json({ msg: "Test Response" }, { status: 200 });
}

// export async function GET(request: Request) {

//     trace.loadImage('https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/13/ceec02f4961a5e0b68fed03b4f9c72f42e638811.png', options, function (err) {
//         if (err) throw err;

//         const path = trace.getPathTag();
//         console.log(path);
//     })
// }
