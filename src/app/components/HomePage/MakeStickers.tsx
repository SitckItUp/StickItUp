'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const cutlineOptions : string[] = ['Countour cut', 'Square', 'Circle', 'Round corners']
const sizeOptions: string[] = ['2" x 1"', '2" x 2"', '3" x 2"', '3" x 3"', '4" x 4"']
const quantityOptions: number[] = [1,3,5,10,20]

export default function MakeStickers() {
  const router = useRouter();

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

  function selectQuantity(quantity?: number | null, e?: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target.name === 'custom-equantity') {
      setQuantity(parseInt(e.target.value))
    }
    else setQuantity(quantity)
  }


  // upload file to s3 bucket
  function imgFileHandler(image: File) {
    
  }

  async function uploadHandler(e: any) { // setting e type to React.ChangeEvent<HTMLInputElement> throws null error for .files
    if (e.target.files[0]) {
      // e.preventDefault();
      // const imgURL = URL.createObjectURL(e.target.files[0]);
      console.log(e.target.files[0]);
      setImgFile(e.target.files[0]);
      const data = await fetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
          img: e.target.files[0].name,
        }),
      })
      const res = await data.json(); 
      console.log('response = ', res);
    }

    /*
    Cam - add first anon session check here 
      - ping next.js API to check if anon session exists
      - (iron-session) to create session cookie
      - redirect to editor page w/ url params set to reference S3 bucket that holds the image
      - sample redirect URL declaration: /editor?imgURL=${imgURL} 
    */

    router.push('/editor');
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
              <li className='flex w-3/4'>
                <input name="custom-width" className='text-center w-1/2' type="number" onChange={(e) => selectCustomSize(e)} />
                <span className='mx-2'>X</span>
              <input className='text-center w-1/2' name="custom-height" type="number" onChange={(e) => selectCustomSize(e)}/>
              {/* <p>{`${customSize.width} x ${customSize.height}`}</p> */}
            </li>
            <p>{size}</p>
          </ul>
        </div>
        <div className="container">
          <h1 className="mb-4 text-xl font-bold">Quantity</h1>
          <ul>
            {quantityOptions.map(quant => {
              return (
                <li className={quantity > 0 && quantity === quant ? "bg-gray-300 py-2" : 'hover:bg-gray-300 py-2' } onClick={(e) => selectQuantity(quant)}>
                  {`${quant} pc`}
                </li>
              )
            })}
            <label>Custom quantity:</label>
            <li>
              <input name="custom-quantity" className="text-center w-1/2" type="number" min="1" value={quantity} onChange={(e) => selectQuantity(null,e)} />
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
              onChange={uploadHandler}
            />
            <label htmlFor="files" className="w-full bg-gold-100 hover:bg-gold-300 hover:cursor-pointer py-2 px-4 rounded-3xl font-medium">
              UPLOAD FILE
            </label>
            <small className="flex justify-column">JPEG, PNG, SVG</small>
            <div>
              {imgFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(imgFile)}
                    width="300"
                    height="300"
                    alt="File preview"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
