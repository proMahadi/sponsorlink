import React, { useState } from "react";
import "@/styles/ui/CustomSelect.css";
import { FaAngleDown, FaPlus } from "react-icons/fa6";
import { Button, Spacer } from "@geist-ui/core";
import { RxCross2 } from "react-icons/rx";

const CustomSelect = ({
  searchComponent,
  formDataTags,
  tagChoices,
  formData,
  handleAddNewTag,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [addedTags, setAddedTags] = useState([]);

  const handleAddTag = (id) => {
    // setAddedTags((prev)=> ({...prev,id}))
    setAddedTags((prev) => [...prev, id]);
  };

  const allAddedTags = [...new Set(addedTags)];
  console.log(allAddedTags);

  const handleDeleteTag = (e, id) => {
    e.stopPropagation();
    setAddedTags((prev) => prev.filter((filteredId) => filteredId !== id));
  };

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
        {allAddedTags.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              maxWidth: "350px",
            }}
          >
            {allAddedTags.map((singleAddedTag) => {
              const exactTag = tagChoices.find(
                (choice) => choice.id === singleAddedTag
              );
              console.log(exactTag.label);
              return (
                <span
                  style={{
                    background: "#dedede4d",
                    padding: "2px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {exactTag.label}
                  <RxCross2
                    onClick={(e) => handleDeleteTag(e, singleAddedTag)}
                  />
                </span>
              );
            })}
          </div>
        ) : (
          <span>Select Tags</span>
        )}
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
          <div style={{
            position:"relative"
          }}>
            {searchComponent}
            <div className="addTagBtn" onClick={handleAddNewTag}><FaPlus/></div>
          </div>
          <div className="allOptions">
            {formDataTags.length > 0
              ? formData.tags.map((tag) => (
                  <div
                    onClick={() => handleAddTag(tag.id)}
                    className="singleOption"
                  >
                    <p>{tag.label}</p>
                  </div>
                ))
              : tagChoices.map((choice) => (
                  <div
                    onClick={() => handleAddTag(choice.id)}
                    className="singleOption"
                  >
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
