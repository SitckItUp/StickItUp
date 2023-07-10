import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

export async function POST (request: Request) {
  const cookieStore = cookies();
  const cookie = cookieStore.get('session');

  // need to parse request body in order to destructure variables
  const res = await request.json();
  const { img } = res;

  // check if cookie exists, set if undefined
  if (cookie) {
    const { id, latestURL, img } = JSON.parse(cookie.value);
    // console.log('session cookie id: ', id, ' latestURL: ', latestURL, ' img: ', img);
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
  }

  return NextResponse.json( {message: 'POST request received'} );
}
