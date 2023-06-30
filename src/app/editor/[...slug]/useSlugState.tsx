// import { useState, useEffect} from "react"
// export function useSlugState<T>(initialSlug:string[],position:number,serialize:(state:T)=>string,deserialize:(state:string)=>T) {
  
//   const [State,setState] = useState(initialSlug[position]);

//   useEffect(() => {
//     // Updates state when user navigates backwards or forwards in browser history
//     if (deserialize(initialSlug[position]) !== state) {
//       setState(deserialize(existingValue));
//     }
//   }, [existingValue]);
//   function onChange () {
//   }
//   return [slugState,onChange]
// }