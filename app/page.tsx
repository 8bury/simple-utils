import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavBar />
      <div>
        <h1 className="text-center mx-auto mt-10 text-3xl font-bold">simple utils</h1>
        <ul>
          <li className="container mx-auto px-4 py-8 w-max">
            <Link href="/video-downloader" className="mx-auto text-center">video downloader</Link>
          </li>
        </ul>
      </div>
    </>
  );
}




