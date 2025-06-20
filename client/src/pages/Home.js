import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import './styles/Home.css';

function Home() {
  const posts = LoadPosts();

  return (
    <div className="posts-container">
      {posts.map((id, title, content, thumbnail) => 
      <Post 
        postID={id} 
        postTitle={title}
        postContent={content}
        postThumbnail={thumbnail}
        />)}
    </div>
  );
}

function LoadPosts () {
  const [posts, setPosts] = useState([]);
  axios.get("http://localhost:3000/loadPosts")
    .then(res => setPosts(res.data))
    .catch(error => console.log(error));

  return posts;
  
}

export default Home;