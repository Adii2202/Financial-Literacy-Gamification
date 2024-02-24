import React, { useEffect, useState } from 'react';
import { blogList } from '../components/blog/config/data';
import Add from '../components/Add'

function Blog() {
  const [id, setId] = useState(window.location.pathname.split('/')[2]);
  const [blog, setBlog] = useState();
  const [allBlogs, setAllBlogs] = useState(JSON.parse(localStorage.getItem('blogs')).articles);

  useEffect(() => {
    const blogId = parseInt(window.location.pathname.split('/')[2], 10);
    setId(blogId);
    const selectedBlog = allBlogs.find((blog) => blog.articlesId === blogId);
    setBlog(selectedBlog);
  }, [window.location.pathname]);

  function convertToNormalDateTime(dateTimeString) {
    // Split date and time
    const [datePart, timePart] = dateTimeString.split(' ');
  
    // Split year, month, and day
    const [year, month, day] = datePart.split('-');
  
    // Split hour, minute, and second
    const [hour, minute, second] = timePart.split(':');
  
    // Create a new Date object
    const dateTime = new Date(year, month - 1, day, hour, minute, second);
  
    // Format the date and time
    const formattedDateTime = dateTime.toLocaleString();
  
    return formattedDateTime;
  }

  return (
    <div className="w-full px-4">
      {blog ? (
        <div className="w-full mx-auto mt-8 flex flex-col items-center justify-center gap-2">
        <h1 className="text-center font-bold mb-4 text-6xl">{blog.authors[0].authorName}</h1>
          <h5 className="text-3xl w-full text-center">{blog.articlesName}</h5>
          <div className="inline-block bg-gray rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 text-white"># {blog.tags[0].name}</div>
         
          <img src={blog.files[0]?.urlCdn || 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202302/abans-holdings-shares-fall-19-on-debut-ep_0-sixteen_nine.jpeg?size=948:533'} alt='img' 
          className="w-1/2 mb-4" />
          <p className="text-gray w-3/4">{blog.articlesDescription}</p>
          {/* <p className="text-gray w-3/4"> <div dangerouslySetInnerHTML={{ __html: blog.articlesDescription }} /></p> */}
          <p className="text-gray mb-2  self-end bottom-0 right-0">{convertToNormalDateTime(blog.publishedAt.date)}</p>
          {/* Add more JSX to display other properties of the blog */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Blog