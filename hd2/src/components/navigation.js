"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons/faRankingStar";
import { faSeedling } from "@fortawesome/free-solid-svg-icons/faSeedling";
import { usePathname, useRouter } from "next/navigation";
import SignInOutButton from "./SignInOutButton";

export default function Navbar() {
  const pathname = usePathname();

  const isNavItemActive = (pathToCheck, actualPath) => {
    return pathToCheck === actualPath;
  };

  return (
    <nav className="navbar w-full bg-base-100">
      <button className="btn">BBC</button>
      <ul className="menu menu-horizontal w-[90%] flex justify-end">
        <li>
          <Link
            className={isNavItemActive("/", pathname) ? "active" : ""}
            href="/"
          >
            {/* <FontAwesomeIcon
              icon={faHouse}
              className={
                isNavItemActive("/", pathname) ? "text-primary" : "neutral"
              }
            /> */}
            Home
          </Link>
        </li>

        <li>
          <Link
            className={isNavItemActive("/notes", pathname) ? "active" : ""}
            href="/notes"
          >
            {/* <FontAwesomeIcon
              icon={faRankingStar}
              className={
                isNavItemActive("/notes", pathname) ? "text-primary" : "neutral"
              }
            /> */}
            Notes
          </Link>
        </li>

        <li>
          <Link
            className={isNavItemActive("/upload", pathname) ? "active" : ""}
            href="/upload"
          >
            {/* <FontAwesomeIcon
              icon={faSeedling}
              className={
                isNavItemActive("/upload", pathname)
                  ? "text-primary"
                  : "neutral"
              }
            /> */}
            Upload
          </Link>
        </li>
      </ul>
      <SignInOutButton />
    </nav>
  );
}
