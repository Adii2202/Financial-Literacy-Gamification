import React from 'react';

const lessonContent = {
  investing: {
    title: 'Investing Essentials',
    content: 'Investing is the process of allocating money with the expectation of generating income or profit. It involves various assets such as stocks, bonds, real estate, and commodities.',
    videoLink: 'https://www.youtube.com/embed/your-investing-video-id'
  }
};

function Lesson1() {

  return (
    <div className="lesson-container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">{lessonContent.investing.title}</h1>
      <p className="mb-4">{lessonContent.investing.content}</p>

      <div className="video-container mb-4">
      <iframe width="702" height="395" src="https://www.youtube.com/embed/TLGalocqj00?list=PL8uhW8cclMiOa7d0IkBnkuNFsq7IUSlpl" title="Top 5 Investment Strategies for Beginners | Investment Masterclass" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>

      {/* Playlist */}
      <div className="playlist mt-4">
        <h2 className="text-lg font-semibold mb-2">Playlist</h2>
        <ul>
          {/* You can add list items for different lessons here */}
          <li><a href="#">Investing Essentials</a></li>
          {/* Add more lessons as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Lesson1;
