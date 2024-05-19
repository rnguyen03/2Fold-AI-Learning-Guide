"use client";

import Link from "next/link";
import ChatGPT from "../components/ChatGPT";
import SimpleMDEEditor from "../components/SimpleMDEEditor"; // Correct import
import { useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import ThreeSetup from "@/components/three/ThreeSetup";
import ThreeRabbit from "@/components/three/ThreeRabbit";
import ThreeTiger from "@/components/three/ThreeTiger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import {
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import GoogleButton from "@/components/GoogleButton";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <main className="z-10 flex flex-col gap-y-4 justify-center items-center h-content">
        {/* <ChatGPT />
        <SimpleMDEEditor /> */}
        {/* <h1>Welcome to the homepage!</h1>
        <p>User is {!session?.user && "NOT"} logged in</p> */}
        {/* 3D */}
        <div
          className="z-20"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <ThreeRabbit />
          <ThreeSetup />
        </div>
        {/* <div className=" w-[200px] h-[200px] bg-red-200"></div> */}
        {/* Search Bar */}
        {session?.user ? (
          <form
            className="form-control basis-2/12 w-[35%]"
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoading(true);
              router.push(pathname + "?" + createQueryString("q", searchQuery));
              // TODO: Make call to search for new notes
              setIsLoading(false);
            }}
          >
            <div className="relative border p-2 rounded-xl">
              <input
                className="w-full pl-2 pr-8 py-2 outline-none"
                type="text"
                placeholder="Ask Shitter for Notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-70"
                icon={faMagnifyingGlass}
              />
            </div>
          </form>
        ) : (
          <>
            <button
              className="btn btn-lg btn-primary font-bold"
              onClick={() => signIn("google", { redirectTo: "/" })}
            >
              Get started!
            </button>
          </>
        )}

        {/* TODO: Conditionally render when data is found */}
        <button className="flex flex-col items-center justify-center w-full basis-2/12 bg-primary text-white font-bold text-lg">
          <p>Scroll for Results</p>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </main>
      {/* Notes */}
      <div className="mt-12 mx-8 max-w-screen-2xl max-h-content" role="group">
        <ul className="flex gap-x-2 gap-y-2 flex-wrap items-center justify-center overflow-y-auto max-w-screen-2xl rounded-2xl bg-gray-200 px-2 py-4">
          <li>
            <div class="card w-72 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card w-72 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card w-72 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card w-72 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card w-72 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card w-72 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
