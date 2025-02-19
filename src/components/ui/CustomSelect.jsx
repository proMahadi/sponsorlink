import React from "react";
import "@/styles/ui/CustomSelect.css";
import { FaAngleDown } from "react-icons/fa6";

const CustomSelect = () => {
  return (
    <div
      Id="customSelect"
      style={{
        position: "relative",
      }}
    >
      <div className="customSelectTrigger">
        <span>Select Tags</span>
        <FaAngleDown />
      </div>
      <div className="selectOptions"
      style={{
        position:"absolute",
        width:"95.5%",
        top:"50px",
        zIndex:999,
      }}
      >
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
        <div className="singleOption">
            <p>choto babu</p>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
