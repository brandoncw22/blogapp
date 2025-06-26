import React, { useState} from 'react';
import './styles/PostSubmission.css';

import axios from 'axios';

function PostSubmission({setPostFlag}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = content;

      setContent(value.substring(0, start) + '    ' + value.substring(end));

      // Move cursor after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      });
    }
  };
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
      setPostFlag(true);
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
        onKeyDown={handleKeyDown}
        rows={12}
        className="post_textarea"
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