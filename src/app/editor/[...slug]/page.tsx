"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Editor({ params }: { params: { slug: Array<number> } }) {
  const searchParams = useSearchParams();
  let quantity,height,width;
  if(params.slug.length === 3 && params.slug.every((el)=>typeof el === "number")){
    [quantity,height,width] = params.slug;
  }else{
    throw new Error("Incorrect path");
    return;
  }
  const [heightState, setHeightState] = useState(height);

  return (
    <div>
      <h1>quantity is: {quantity}</h1>
      <h1>Height is : {heightState}</h1>
      <h1>width is : {width}</h1>
      
    </div>
  );
}
