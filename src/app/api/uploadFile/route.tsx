import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: 'v4',
})

export async function POST (req: Request) {
  try {
    const res = await req.json();
    console.log('req body ', res);
    let { name, type } = res;
    console.log('name and type', name, type);

    const bucket = process.env.S3_BUCKET_NAME;
    const region = process.env.S3_REGION;

    const fileParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      ACL: 'public-read',
    };

    const signedURL = await s3.getSignedUrlPromise("putObject", fileParams);
    console.log('signed URL ', signedURL);

    return NextResponse.json({ signedURL, bucket, region }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err }, { status: 400})
  }
};


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // set size limit for uploads
    }
  }
}