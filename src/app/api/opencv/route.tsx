import { NextRequest as Request, NextResponse } from "next/server";
const cv = require("opencv.js");

export async function GET(request: Request) {
  let src = cv.imread("https://i.imgur.com/kAYeTy0.png", cv.IMREAD_UNCHANGED);
  let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(src, src, 10, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(
    src,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );
  // draw contours with random Scalar
  for (let i = 0; i < contours.size(); ++i) {
    let color = new cv.Scalar(255, 255, 255);
    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
  }
  cv.imshow("canvasOutput", dst);
  src.delete();
  dst.delete();
  contours.delete();
  hierarchy.delete();

  return NextResponse.json({ msg: "Test Response" }, { status: 200 });
}
