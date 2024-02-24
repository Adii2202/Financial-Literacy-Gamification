import React from 'react';
import { Link } from 'react-router-dom';
import Chip from '../../../common/Chip';
import authorAvatar from '/assets/images/author.jpg';
import './styles.css';

const BlogItem = ({
  // blog: {
  //   description,
  //   title,
  //   createdAt,
  //   authorName,
  //   authorAvatar,
  //   cover,
  //   category,
  //   id,
  // },
  blog
}) => {

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
    <div className='blogItem-wrap'>
      <img className='blogItem-cover' src={blog.files[0]?.urlCdn || 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202302/abans-holdings-shares-fall-19-on-debut-ep_0-sixteen_nine.jpeg?size=948:533'} alt='cover' />
      <Chip label={blog.tags} />
      <h3>{blog.articlesName}</h3>
      <p className='blogItem-desc'>{blog.articlesShortDescription}</p>
      <footer>
        <div className='blogItem-author'>
          <img src={authorAvatar} alt='avatar' />
          <div>
            <h6>{blog.authors[0].authorName}</h6>
            <p>{convertToNormalDateTime(blog.publishedAt.date)}</p>
          </div>
        </div>
        <Link className='blogItem-link' to={`/blog/${blog.articlesId}`}>
          ➝
        </Link>
      </footer>
    </div>
  );
};

export default BlogItem;
