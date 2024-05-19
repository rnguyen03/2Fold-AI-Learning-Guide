"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignInOutButton from "./SignInOutButton";

export default function Navbar() {
  const pathname = usePathname();

  const isNavItemActive = (pathToCheck, actualPath) => {
    return pathToCheck === actualPath;
  };

  return (
    <nav className="navbar w-full bg-base-100">
      <button className="btn">2Fold</button>
      <ul className="menu menu-horizontal w-[90%] flex justify-end">
        <li>
          <Link
            className={isNavItemActive("/", pathname) ? "active" : ""}
            href="/"
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            className={isNavItemActive("/notes", pathname) ? "active" : ""}
            href="/notes"
          >
            Notes
          </Link>
        </li>

        <li>
          <Link
            className={isNavItemActive("/upload", pathname) ? "active" : ""}
            href="/upload"
          >
            Upload
          </Link>
        </li>
      </ul>
      <SignInOutButton />
    </nav>
  );
}
