import React from "react";

function RemoveButton() {
  return (
    <button
      type="button"
      className="bg-gray-100 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
    >
      <span className="sr-only"></span>

      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

export default RemoveButton;
