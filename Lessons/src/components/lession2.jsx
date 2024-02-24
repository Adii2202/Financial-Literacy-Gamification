import React from 'react';

const lessonContent = {
  investing: {
    title: 'Financing Fundamentals',
    content: 'Financing involves acquiring funds to support activities, projects, or purchases. It includes various methods such as loans, credit, and fundraising.',
    videoLink: 'https://www.youtube.com/embed/your-investing-video-id'
  }
};

function Lesson2() {

  return (
    <div className="lesson-container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">{lessonContent.investing.title}</h1>
      <p className="mb-4">{lessonContent.investing.content}</p>

      <div className="video-container mb-4">
      <iframe width="702" height="395" src="https://www.youtube.com/embed/LLdKcFpHgM8?list=PL8uhW8cclMiOSfw_Kzi6YpLx1PhL8GIS9" title="Financial Planning for Beginners | Personal Financial Planning Course P1 By CA Rachana Phadke Ranade" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    </div>
  );
}

export default Lesson2;

