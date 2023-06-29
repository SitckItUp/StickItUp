import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-max flex justify-center items-center">
        <div className="flex flex-col items-center max-w-xl">
          <div className="text-4xl text-center -rotate-6 mb-8">PRINT CUSTOM STICKERS!</div>
          <div>Make your own custom stickers, labels and decals with our insanely smooth and easy sticker maker editor.</div>
        </div>
        <Image
          src="https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/13/ceec02f4961a5e0b68fed03b4f9c72f42e638811.png"
          alt="image placeholder"
          width="500"
          height="500"
        />
      </div>
      <div className="text-center rounded-lg p-1 shadow-md border-0 border-black hover:bg-gold hover:cursor-pointer w-max">
        <Link href="/editor" aria-label="Editor">
          Go to editor/upload image
        </Link>
      </div>
    </div>
  );
}
