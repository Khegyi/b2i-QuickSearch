"use client"; // This is a client-side component
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

// Todo move this to a .env file
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

const QuickSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [maxResults, setMaxResults] = useState<number>(5);
  const [displayResults, setDisplayResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string|null>(null)

  const handleSelect = (result: SearchResult) => {
    setSelectedResult(result);
    setDisplayResults(false);
  };

  function checkSearchTerm() {
    if (searchTerm.length < 3) {
      setErrorMessage("Search term must be at least 3 characters");
      return false;
    }
    setErrorMessage(null);
    return true;
  }


  async function getSearchResults() {
    setDisplayResults(false);

    if (!checkSearchTerm()) return;
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
    request.data.items.length > 0
      ? setDisplayResults(true)
      : setDisplayResults(false);
    setLoading(false);
  }

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="max-results">Max Results: {maxResults}</label>
        <input
          type="range"
          id="max-results"
          min="1"
          disabled={loading}
          max="100"
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          disabled={loading}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getSearchResults()}
          style={{
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
            color: "black",
          }}
        />
        <button
          onClick={getSearchResults}
          disabled={loading}
          style={{
            padding: "5px",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
            src="/search_icon.svg"
            alt="Search"
            title="Search"
            width={15}
            height={15}
            priority
          />
        </button>
        {errorMessage && <div style={{color: "red"}}>{errorMessage}</div>}

        {displayResults && (
          <div
            style={{
              border: "1px solid #ccc",
              backgroundColor: "white",
              position: "absolute",
              width: "100%",
              maxHeight: "50vh",
              overflowY: "auto",
              zIndex: 1,
            }}
          >
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleSelect(result)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  color: "black",
                }}
              >
                {highlightTerm(result.pt.term, searchTerm)}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedResult && (
        <div style={{ marginTop: "20px", color: "white" }}>
          <strong>Selected:</strong> {selectedResult?.id} |{" "}
          {selectedResult?.pt.term}
        </div>
      )}
    </div>
  );
};
export default QuickSearch;
