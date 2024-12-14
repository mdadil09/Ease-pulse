import React from "react";

const Spinner = () => {
  return (
    <div className="backdrop-blur-[2px] z-50 fixed top-0 w-[100%] h-[100%]">
      <div
        className="animate-spin inline-block size-12 border-[4px] border-current border-t-transparent text-green-500 rounded-full dark:text-green-700 fixed top-96 left-[46%]"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
