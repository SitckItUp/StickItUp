'use client'

import { useState, useEffect } from 'react';

const cutlineOptions = ['Countour cut', 'Square', 'Circle', 'Round corners']
const sizeOptions = ['2" x 1"', '2" x 2"', '3" x 2"', '3" x 3"', '4" x 4"']

export default function MakeStickers() {

  const [cutLine, setCutLine] = useState('');
  const [size, setSize] = useState('')
  const [customSize, setCustomSize] = useState({width: '', height: ''})
  const [quantity, setQuantity] = useState(0)
  const [material, setMaterial] = useState(null)
  const [imgFile, setImgFile] = useState(null);

  useEffect(() => {
    if (customSize.width !== '' && customSize.height !== '') {
      setSize(`${customSize.width}" x ${customSize.height}"`)
    }
  }, [customSize])

  function selectCutOption(cut: string) {
    setCutLine(cut)
  }

  function selectSize(size: string) {
    setSize(size);
  }

  function selectCustomSize(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.name === 'custom-width' ? 
    setCustomSize((prevState)=>{return{...prevState, width: e.target.value}})
    :
    setCustomSize((prevState)=>{return{...prevState, height: e.target.value}})
  }


  // upload file to s3 bucket
  function imgFileHandler(image: File) {
    
  }

  return (
    // border-2 border-indigo-600
    <div className="w-full p-8">
      <h1 className="mb-4 text-2xl font-bold">Make Stickers</h1>
      <p>
        Add-ons like back paper print, pink ink and invisible ink can be
        requested in our sticker maker. Just leave a comment!
      </p>
      <div className="container w-full flex mt-4 mx-auto">
        <div className="container">
          <h1 className="mb-4 text-xl font-bold">Cutline</h1>
          <ul className='w-full'>
            {cutlineOptions.map(option => {
              return <li className={cutLine === option ? "bg-gray-300 py-2" : "hover:bg-gray-300 py-2"} onClick={() => selectCutOption(option)}>{option}</li>
            })}
          </ul>
        </div>
        <div className="container">
          <h1 className="mb-4 text-xl font-bold">Size</h1>
          <ul>
            {sizeOptions.map(option => {
              return <li className={size === option ? "bg-gray-300 py-2" : "hover:bg-gray-300 py-2"} onClick={() => selectSize(option)}>{option}</li>
            })} 
            <label>Custom Size</label>
              <li className='flex'>
                <input name="custom-width" className='text-center w-1/2' type="number" onChange={(e) => selectCustomSize(e)} />
                <span className='mx-2'>X</span>
              <input className='text-center w-1/2' name="custom-height" type="number" onChange={(e) => selectCustomSize(e)}/>
              {/* <p>{`${customSize.width} x ${customSize.height}`}</p> */}
              <p>{size}</p>
              </li>
          </ul>
        </div>
        <div className="container">
          <h1 className="mb-4 text-xl font-bold">Quantity</h1>
          <ul>
            <li className='hover:bg-gray-300 py-2'>
              Item 1
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 2
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 3
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 4
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 5
            </li>
          </ul>
        </div>
        <div className="container">
          <h1 className="mb-4 text-xl font-bold">Material</h1>
          <ul>
            <li className='hover:bg-gray-300 py-2'>
              Item 1
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 2
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 3
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 4
            </li>
            <li className='hover:bg-gray-300 py-2'>
              Item 5
            </li>
          </ul>
          <div id="upload">
            <input id="files" className="invisible" type="file" accept="image/jpeg, image/png, image/svg+xml" 
              onChange={(e) => {
                if (e.target.files[0]) {
                  console.log(e.target.files[0]);
                  setImgFile(e.target.files[0]);
                }
              }}/>
            <label htmlFor="files" className="w-full bg-gold-100 hover:bg-gold-300 hover:cursor-pointer py-2 px-4 rounded-3xl font-medium">
              UPLOAD FILE
            </label>
            <small className="flex justify-column">JPEG, PNG, SVG</small>
          </div>
        </div>
      </div>
    </div>
  );
}
