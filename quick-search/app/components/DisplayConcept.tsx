import React from "react";

interface DisplayConceptProps {
  selectedConcept: { id: string; term: string } | null;
}

const DisplayConcept: React.FC<DisplayConceptProps> = ({ selectedConcept }) => {
  return (
    <div className="text-md ">
      <span>Selected Concept:</span>
      <div>
        {selectedConcept !== null
          ? selectedConcept?.id + " | " + selectedConcept?.term + " | "
          : "None"}{" "}
      </div>
    </div>
  );
};

export default DisplayConcept;
