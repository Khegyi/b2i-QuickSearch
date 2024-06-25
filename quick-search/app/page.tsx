"use client"; 
import DisplayConcept from "./components/DisplayConcept";
import QuickSearch from "./components/QucikSearch";
import {  useState } from "react";

interface DisplayConceptProps {
  id: string;
  term: string;
}

export default function Home() {
  const [selectedConcept, setSelectedConcept] =
    useState<DisplayConceptProps | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="relative flex place-items-center w-full pb-5">
      <DisplayConcept selectedConcept={selectedConcept} />
      </div>
      <div className="relative flex place-items-center">
      
        <QuickSearch setSelectedConcept={setSelectedConcept} />
      </div>
    </main>
  );
}
