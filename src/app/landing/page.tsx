import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div>
      <span className="text-4xl text-center">PRINT CUSTOM STICKERS</span>
      <Image
        src="./public/next.svg"
        alt="image placeholder"
        width="500"
        height="500"
        style={{ display: "inline" }}
      />
      <div className="text-center border-2 border-indigo-600 hover:bg-slate-600 hover:cursor-pointer">
        <Link href="/editor" aria-label="Editor">
          Go to editor/upload image
        </Link>
      </div>
    </div>
  );
}
