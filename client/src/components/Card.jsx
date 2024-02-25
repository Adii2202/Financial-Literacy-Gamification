import React from "react";
import './card.css'

const SmallCard = () => {
  // Check if the joining link is present
  const joiningLink = "https://www.example.com"; // Example link, replace it with your actual joining link
  const linkColor = joiningLink ? "#3B82F6" : "red";

  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Aditya Ningule</div>
        <p className="text-gray-700 text-base mb-2">Profession: CA</p>
        <a
          style={{ color: "#3B82F6" }}
          className="text-blue-700 text-base mb-2"
          href="https://www.linkedin.com/in/aditya-ningule/"
        >
          LinkedIn
        </a>
        <p className="text-gray-700 text-base mt-2 mb-2">Level: 3</p>
        <a
          style={{ color: linkColor }} // Set the color dynamically
          href={joiningLink || "#"} // Set the href conditionally
          className="text-blue-700 block"
        >
          Joining Link
        </a>
        <div className="mt-2">
          <p className="text-gray-700 text-base mb-2">Are you in?</p>
          <div className="flex justify-between">
            <button className="yes-button">Yes</button>
            <button className="no-button">No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
