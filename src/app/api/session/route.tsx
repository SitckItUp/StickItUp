import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {v4 as uuidv4 } from 'uuid';

export async function POST (request: Request) {
  console.log('POST request received');
  const cookieStore = cookies();
  const cookie = cookieStore.get('session');
  const res = await request.json();
  console.log('request body: ', res);
  const { img } = res;
  if (cookie) {
    const { id, latestURL, img } = JSON.parse(cookie.value);
    console.log('session cookie id: ', id, ' latestURL: ', latestURL, ' img: ', img);
  } else {
    // need to set cookie
    const id = uuidv4()
    const latestURL = "/param1/param2/param3"
    const val = JSON.stringify({id, latestURL, img})
    cookies().set(
      'session',
      val,
      { secure: true }
    )
    console.log('session cookie set: ', id);
  }

  return NextResponse.json( {message: 'POST request received'} );
}
