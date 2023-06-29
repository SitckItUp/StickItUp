import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-12 text-white bg-slate-950">
      <div>Logo</div>
      <div className="flex justify-self-center">
        <Link href="/" aria-label="Home">
          Home
        </Link>
      </div>
      <div className="flex justify-self-center">
        <Link href="/landing" aria-label="Stickers">
          Stickers
        </Link>
      </div>
    </nav>
  );
}
