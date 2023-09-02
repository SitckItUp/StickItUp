'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import S3 from 'aws-sdk/clients/s3';
import { Url } from 'next/dist/shared/lib/router/router';


const cutlineOptions : string[] = ['Contour cut', 'Square', 'Circle', 'Round corners'];
const sizeOptions: string[] = ['2" x 1"', '2" x 2"', '3" x 2"', '3" x 3"', '4" x 4"'];
const quantityOptions: number[] = [1, 3, 5, 10, 20];
// Placeholder for material options
const materialOptions: string[] = ['Vinyl', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];


export default function MakeStickers() {
  const router = useRouter();

  const [cutLine, setCutLine] = useState('Contour cut');
  const [size, setSize] = useState('2" x 1"');
  const [customSize, setCustomSize] = useState({width: '', height: ''});
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState('Vinyl');
  const [imgFile, setImgFile] = useState(null);
  const [uploadedImgURL, setUploadedImgURL] = useState(null);

  useEffect(() => {
    if (customSize.width !== '' && customSize.height !== '') {
      setSize(`${customSize.width}" x ${customSize.height}"`)
      // console.log('custom size', customSize);
      // console.log('size', size);
    }
  }, [customSize]);

  useEffect(() => {
    if (imgFile) {
      s3Handler(imgFile)
    };
  }, [imgFile]);

  useEffect(() => {
    if (uploadedImgURL) {
      console.log('current states => cutline: ', cutLine, 'size: ', size, 'quantity: ', quantity, 'material: ', material, 'imgURL: ', uploadedImgURL);
      router.push(`/editor/${cutLine}/${size}/${quantity}/${material.toLowerCase()}`);
    }

  }, [uploadedImgURL]);

  function selectCutOption(cut: string) {
    setCutLine(cut)
  }

  function selectSize(size: string) {
    setSize(size);
    // console.log('size', size);
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

  function selectMaterial(material: string) {
    setMaterial(material);
    console.log('material selected', material);
  }


  // upload file to s3 bucket
  async function s3Handler(image: File | null) {
    if (!imgFile) return;
    const data = await fetch('/api/uploadFile', {
      method: 'POST',
      body: JSON.stringify({
        name: image?.name,
        type: image?.type
      })
    })
    const response = await data.json();
    // console.log('response is ', response);
    await fetch(response.signedURL, {
      method: 'PUT',
      headers: {
        "Content-type": image?.type,
        "Access-Control-Allow-Origin": "*"
      },
      body: image,
    })
    const url: Url = `https://${response.bucket}.s3.${response.region}.amazonaws.com/${image?.name}`;
    console.log('url ', url);
    setUploadedImgURL(url);
    console.log(`File uploaded successfully: ${image?.name}`);

  }

  async function uploadHandler(e: any) { // setting e type to React.ChangeEvent<HTMLInputElement> throws null error for .files
    if (e.target.files[0]) {
      // e.preventDefault();
      // const imgURL = URL.createObjectURL(e.target.files[0]);
      console.log('uploaded file: ', e.target.files[0]);
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

    // router.push('/editor');
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
          <ul className='w-full'>
            {materialOptions.map(option => {
              return <li className={material === option ? "bg-gray-300 py-2" : "hover:bg-gray-300 py-2"} onClick={() => selectMaterial(option)}>{option}</li>
            })}
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
              {uploadedImgURL && (
                <div>
                  <Image
                    src={uploadedImgURL}
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
