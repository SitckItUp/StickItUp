"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Editor({ params }: { params: { slug: string[] } }) {
  // searchParams is for url segments that look like '?a=10&b=20'
  // can grab a value via searchParams.get('a');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  //params.slug contains all url segments after our endpoint as str elements
  //for the url endpoint /editor/1/2/3 params.slug will be an array of [1,2,3]
  const [slug, setSlug] = useState<number[]>(params.slug.map(el=>Number(el)));
  //checks to see if url is as expected
  if(slug.length !== 3 || slug.some(el=>isNaN(el))){
    throw new Error("Incorrect path");
    return;
  }
  function onChange (s:number,ind:number){
    setSlug((prev)=>{
      const newArr = prev.slice();
      newArr.splice(ind,1,s)
      return newArr;
    })
  }

  useEffect(()=>{
    router.push(`/editor/${slug[0]}/${slug[1]}/${slug[2]}`);
  },[slug])

  return (
    <div>
      <h1>Height is : {slug[0]}</h1>
      <input type="range" min="0" max="100" value={slug[0]} onChange={(e)=>onChange(Number(e.target.value),0)}/>
      <h1>Width is : {slug[1]} </h1>
      <input type="range" min="0" max="100" value={slug[1]} onChange={(e)=>onChange(Number(e.target.value),1)}/>
      <h1>Quantity is : {slug[2]}</h1>
      <input type="range" min="0" max="100" value={slug[2]} onChange={(e)=>onChange(Number(e.target.value),2)}/>
    </div>
  );
}
