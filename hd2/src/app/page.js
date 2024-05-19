"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { collection, getDocs } from "firebase/firestore";
import { DB } from "@/app/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ThreeSetup from "@/components/three/ThreeSetup";
import ThreeRabbit from "@/components/three/ThreeRabbit";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const { data: session } = useSession();
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

  const fetchCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(DB, "notes"));
      const cardsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(cardsData);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Marker to image map
  const markerToImageMap = {
    Crane: "/crane.png",
    Ox: "/ox.png",
    Tiger: "/tiger.png",
    // Add more markers and their corresponding images here
  };

  const handleViewMoreClick = async (noteId) => {
    try {
      await axios.post('/api/core/notes/toCollection', { noteId });
      router.push(`/notes?noteId=${ noteId }`);
    } catch (error) {
      console.error("Error adding note to user:", error);
    }
  };

  return (
    <>
      <main className="z-10 flex flex-col gap-y-4 justify-center items-center h-content">
        <div className="z-20" style={{ position: "relative", width: "100%", height: "100%" }}>
          <ThreeRabbit />
          <ThreeSetup />
        </div>

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
          <button
            className="btn btn-lg btn-primary font-bold"
            onClick={() => signIn("google", { redirectTo: "/" })}
          >
            Get started!
          </button>
        )}

        <button className="flex flex-col items-center justify-center w-full basis-2/12 bg-primary text-white font-bold text-lg">
          <p>Scroll for Results</p>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </main>

      <div className="mt-12 mx-8 max-w-screen-2xl max-h-content" role="group">
        <ul className="flex gap-x-2 gap-y-2 flex-wrap items-center justify-center overflow-y-auto max-w-screen-2xl rounded-2xl bg-gray-200 px-2 py-4">
          {cards.map((card) => (
            <li key={card.id}>
              <div className="card w-72 bg-base-100 shadow-xl">
                <figure className="p-2 border-4 border-gray-300">
                  <Image
                    src={markerToImageMap[card.marker] || "/tiger.png"} // Use the marker-to-image map
                    alt={card.title}
                    width={1000}
                    height={1000}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{card.title}</h2>
                  <p>{card.summary}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={() => handleViewMoreClick(card.id)}>View More</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
