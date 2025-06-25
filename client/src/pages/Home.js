import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import Submission from '../components/PostSubmission';
import './styles/Home.css';

function Home({isLoggedIn}) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3030/loadPosts")
      .then(res => setPosts(res.data))
      .catch(error => console.error("Error loading posts:", error));
  }, []);
  return (
    <>
    <div className="home_page">
      {isLoggedIn && <Submission />}
      <div className="posts_container">
      
        {posts.map((post) => 
        <Post 
          id={post.postID} 
          title={post.postTitle}
          content={post.postContent}
          thumbnail={`http://localhost:3030/storage/thumbnail_post${post.postID}.jpg`}
          isLoggedIn={isLoggedIn}
          setPosts={setPosts}
          key={post.postID}
          />)}
      </div>
    </div>
    
    
    </>
  );
}

export default Home;