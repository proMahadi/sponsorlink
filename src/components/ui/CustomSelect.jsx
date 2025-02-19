import React, { useState } from "react";
import "@/styles/ui/CustomSelect.css";
import { FaAngleDown } from "react-icons/fa6";
import { Spacer } from "@geist-ui/core";

const CustomSelect = ({
  searchComponent,
  formDataTags,
  tagChoices,
  formData,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div
      id="customSelect"
      style={{
        position: "relative",
      }}
    >
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="customSelectTrigger"
      >
        <span>Select Tags</span>
        <FaAngleDown
          style={
            showOptions
              ? {
                  rotate: "180deg",
                  transition: "all linear 0.3s",
                }
              : { rotate: "0deg", transition: "all linear 0.3s" }
          }
        />
      </div>
      {showOptions && (
        <div className="selectOptions">
          <Spacer h={0.5}></Spacer>
          {searchComponent}
          <div className="allOptions">
            {formDataTags.length > 0
              ? formData.tags.map((tag) => (
                  <div className="singleOption">
                    <p>{tag}</p>
                  </div>
                ))
              : tagChoices.map((choice) => (
                  <div className="singleOption">
                    <p>{choice.label}</p>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
