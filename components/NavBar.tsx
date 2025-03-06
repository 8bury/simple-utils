import Link from "next/link";

export default function NavBar() {
    return <nav className="bg-gray-800 pt-4 pb-4">
        <ul className="flex space-x-8">
            <li>
                <Link href="/" className="text-white hover:text-gray-300 transition ml-10 ">home</Link>
            </li>
            <li>
                <Link href="/video-downloader" className="text-white hover:text-gray-300 transition">video downloader</Link>
            </li>
        </ul>
    </nav>;
}