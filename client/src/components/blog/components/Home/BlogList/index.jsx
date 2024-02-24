import React from 'react';
import BlogItem from './BlogItem';
import './styles.css';

const BlogList = ({ blogs, allBlogs }) => {
  return (
    <div className='blogList-wrap'>
      {allBlogs.articles.map((blog) => (
        <BlogItem blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
