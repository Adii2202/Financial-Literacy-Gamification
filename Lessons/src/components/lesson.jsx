import React from 'react';

const lessonContent = {
  budgeting: {
    title: 'Budgeting Basics',
    content: 'Budgeting is the process of creating a plan to spend your money. It helps you prioritize your spending and track your expenses.',
    videoLink: 'https://www.youtube.com/embed/your-budgeting-video-id'
  }
};

function Lesson() {

  return (
    <div className="lesson-container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">{lessonContent.budgeting.title}</h1>
      <p className="mb-4">{lessonContent.budgeting.content}</p>

      <div className="video-container mb-4">
      <iframe width="702" height="395" src="https://www.youtube.com/embed/g1Xth5XVobg?list=PLnYt61Ja2yQ9k-0LRO58a_I2Q0ZH2wYE4" title="Session 1 - What is  a Budget? (Budgeting Basics)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>      </div>

      {/* Playlist */}
      <div className="playlist mt-4">
        <h2 className="text-lg font-semibold mb-2">Playlist</h2>
        <ul>
          {/* You can add list items for different lessons here */}
          <li><a href="#">Budgeting Basics</a></li>
          {/* Add more lessons as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Lesson;