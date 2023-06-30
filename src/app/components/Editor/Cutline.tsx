import { useState } from "react"

// Cutline Settings
const cutlineSettings = {
  small: {
    text: "Small",
    thumbnail: "small.png",
  },
  medium: {
    text: "Medium",
    thumbnail: "medium.png",
  },
  large: {
    text: "Large",
    thumbnail: "large.png",
  },
  square: {
    text: "Square",
    thumbnail: "square.png",
  },
  circle: {
    text: "Circle",
    thumbnail: "circle.png",
  },
  rounded: {
    text: "Rounded",
    thumbnail: "rounded.png",
  },
}

export default function Cutline () {
  const [activeIcon, setActiveIcon] = useState<string>()

  const handleIconClick = (el: string) => {
    setActiveIcon(el)
  }

  const options: React.ReactNode[] = Object.keys(cutlineSettings).map((el: string) => {
    return (
    <div 
      key={el} 
      className={`hover:bg-slate-200 rounded hover:cursor-pointer ${activeIcon === el ? "bg-gray-300 py-2" : "hover:bg-gray-300 py-2"}}`}
      onClick={() => {handleIconClick(el)}}
    >
      {cutlineSettings[el].text}
    </div>
    )
  })

  return (
    <div className="outline-tool-container flex justify-center self-start bg-slate-100 h-1/6 w-full">
      <div>
        <h1 className="text-2xl font-bold">Cutline</h1>
        <div className="grid grid-cols-3 gap-4">
          {options}
        </div>
      </div>
    </div>
  )
}