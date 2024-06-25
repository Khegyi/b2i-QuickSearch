"use client"; // This is a client-side component
import React, { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import Image from "next/image";

// Todo: move to .env
const apiKey =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTbm93IE93bCIsInN1YiI6ImF1dGgwfDY2Nzk3ZWVmZTJkZGQ4YmIxMjYyOWUzMSIsImlhdCI6MTcxOTIzODQ4MCwiZXhwIjoxNzIwNDQ4MDgwLCJwZXJtaXNzaW9ucyI6WyJicm93c2U6KiJdfQ.HgdlFaEiXqcfR47DSx7tZM-ZalMcVfBPi7sXPbFQ1jYbvaWyvNZWpZti4JTTNaYuPRz8ioN58uUQ4hSKF3Hcfg";

interface SearchResult {
  id: number;
  active?: boolean;
  pt: {
    id: string;
    term: string;
  };
}
interface QuickSearchProps {
  setSelectedConcept: Dispatch<SetStateAction<any>>;
}

const highlightTerm = (text: string, highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <b key={i}>{part}</b>
        ) : (
          part
        )
      )}
    </span>
  );
};

const QuickSearch: React.FC<QuickSearchProps> = ({ setSelectedConcept }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [maxResults, setMaxResults] = useState<number>(5);
  const [displayResults, setDisplayResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelect = (result: SearchResult) => {
    setSelectedConcept(result.pt);
    setDisplayResults(false);
  };

  function checkSearchTermLength() {
    if (searchTerm.length < 3) {
      setErrorMessage("Search term must be at least 3 letters");
      return false;
    }
    setErrorMessage(null);
    return true;
  }

  async function getSearchResults() {
    setDisplayResults(false);

    if (!checkSearchTermLength()) return;
    setLoading(true);
    const request = await axios.get(
      `https://api.snowray.app/snowowl/snomedct/SNOMEDCT/concepts?term=${searchTerm}&limit=${maxResults}&expand=pt()`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
      }
    );
    setSearchResults(request.data.items);
    if (request.data.items.length > 0) {
      setDisplayResults(true);
    } else {
      setErrorMessage("No results found");
      setDisplayResults(false);
    }
    setLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    displayResults && setDisplayResults(false);
    setSearchTerm(e.target.value);
  }

  return (
    <div className="relative w-72">
      <div className="mb-5">
        <label htmlFor="max-results">Result Number: {maxResults}</label>
        <input
          type="range"
          id="max-results"
          min="1"
          disabled={loading}
          max="100"
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-5 relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          disabled={loading}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => e.key === "Enter" && getSearchResults()}
          className="w-full p-2.5 box-border text-black"
        />
        {loading ? (
          <div
            className="absolute top-4 right-4 inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          ></div>
        ) : (
          <button
            onClick={getSearchResults}
            disabled={loading}
            className="absolute top-4 right-4 p-1.25"
          >
            <Image
              className="relative animate-wiggle"
              src="/search_icon.svg"
              alt="Search"
              title="Search"
              width={15}
              height={15}
              priority
            />
          </button>
        )}
        {errorMessage && (
          <div className="text-white mt-1 p-1 text-md rounded bg-orange-500">
            {errorMessage}
          </div>
        )}
        {displayResults && (
          <div className="absolute w-full max-h-[50vh] overflow-y-auto border border-gray-300 bg-white z-10">
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleSelect(result)}
                className="p-2.5 cursor-pointer border-b border-gray-200 text-black hover:bg-gray-100"
              >
                {highlightTerm(result.pt.term, searchTerm)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default QuickSearch;
