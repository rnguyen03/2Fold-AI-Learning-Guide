"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
  const [cards, setCards] = useState([]); // Ensure initial state is an empty array
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cardsRef = useRef(null); // Add a reference to the list of cards

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Marker to image map
  const markerToImageMap = {
    Crane: "/crane.png",
    Ox: "/ox.png",
    Tiger: "/tiger.png",
    // Add more markers and their corresponding images here
  };

  const fetchAdditionalCards = async (count) => {
    try {
      const querySnapshot = await getDocs(collection(DB, "notes"));
      const cardsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Shuffle the array and pick the first `count` elements
      const shuffledCards = cardsData.sort(() => 0.5 - Math.random());
      return shuffledCards.slice(0, count);
    } catch (error) {
      console.error("Error fetching additional cards:", error);
      return [];
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      router.push(pathname + "?" + createQueryString("q", searchQuery));
      const res = await axios.post('/api/core/explore', { searchQuery });

      // Fetch full details of each similar note
      const similarNotes = [];
      console.log("Similar notes:", res.data);

      for (const noteId of res.data) {
          const trimmedNoteId = noteId.trim();
          const noteDoc = await getDoc(doc(DB, "notes", trimmedNoteId));
          if (noteDoc.exists()) {
              similarNotes.push({
                  id: noteDoc.id,
                  ...noteDoc.data(),
              });
          }
      }

      console.log("Similar notes:", similarNotes);

      let fetchedCards = similarNotes;
      if (fetchedCards.length < 5) {
        const additionalCards = await fetchAdditionalCards(5 - fetchedCards.length);
        fetchedCards = fetchedCards.concat(additionalCards); // Append additional cards
      }

      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToResults = () => {
    if (cards.length > 0 && cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to results when cards are updated
  useEffect(() => {
    if (cards.length > 0 && cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cards]);

  return (
    <>
      <main className="z-10 flex flex-col gap-y-4 justify-center items-center h-content">
        <div className="z-20" style={{ position: "relative", width: "100%", height: "100%" }}>
          <ThreeRabbit />
          <ThreeSetup />
        </div>

        {session?.user ? (
          <form className="form-control basis-2/12 w-[35%]" onSubmit={handleSearchSubmit}>
            <div className="relative border p-2 rounded-xl flex">
              <input
                className="w-full pl-2 pr-8 py-2 outline-none"
                type="text"
                placeholder="Ask Shitter for Notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-70"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
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

        <button
          className="flex flex-col items-center justify-center w-full basis-2/12 bg-primary text-white font-bold text-lg"
          onClick={handleScrollToResults}
        >
          <p>Scroll for Results</p>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </main>

      <div ref={cardsRef} className="mt-12 mx-8 max-w-screen-2xl max-h-content" role="group">
        <ul className="flex gap-x-2 gap-y-2 flex-wrap items-center justify-center overflow-y-auto max-w-screen-2xl rounded-2xl bg-gray-200 px-2 py-4">
          {Array.isArray(cards) && cards.map((card) => (
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
