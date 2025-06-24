import React, { useState, useEffect } from 'react';
import './styles/PostSubmission.css';
import axios from 'axios';

function PostSubmission() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send post title/content to backend
      const res = await axios.post('http://localhost:3030/createPost', {
        title,
        content
      });

      const postID = res.data.postID;

      if (thumbnail) {
        const formData = new FormData();
        formData.append('thumbnail', thumbnail);
        formData.append('postID', postID);

        await axios.post('http://localhost:3030/thumbnailUpload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      console.log('Post submitted!');
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post_submit">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        name="content"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="file"
        name="thumbnail"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default PostSubmission;