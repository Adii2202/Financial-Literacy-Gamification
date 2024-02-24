// src/components/Add.js
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Add() {
  const [value, setValue] = useState('');

  
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
    
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
    
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['clean'] ,        ['link', 'image']                                 // remove formatting button
    ];


  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start mx-auto mt-8">
      <ReactQuill
        modules={modules}
        theme="snow"
        value={value}
        onChange={setValue}
        className="w-1/2 h-64 p-4"
      />
    </div>
  );
}

export default Add;
