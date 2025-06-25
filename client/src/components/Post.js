
import { useEffect, useState, useRef } from 'react';
import './styles/Post.css';
import axios from 'axios';
import Popup from 'reactjs-popup';

function Post({id, title, content, thumbnail, isLoggedIn, setPosts}) {
    const [isOpen, setIsOpen] = useState(false);
    const [deletionFlag, setDeletionFlag] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        axios.get("http://localhost:3030/loadPosts")
            .then(res => setPosts(res.data))
            .catch(error => console.error("Error loading posts:", error));
        setDeletionFlag(false);
    }, [deletionFlag]);
    

    return(
        <div className="post" tabIndex={`0`} onClick={toggle}>
            <Popup open={isOpen} onClose={() => setIsOpen(false)} modal nested>
                <div className={`post_focused`}>
                    <div className="post_header">
                        <h1 className="post_title">{title}</h1>
                    </div>
                    <div className="post_picture">
                        {thumbnail && <img 
                            className="thumbnail_focused"
                            src={`${thumbnail}`}
                            alt={`Thumbnail for post ${id}`}
                        />}
                    </div>
                    <div className="">
                        <p>{content}</p>
                    </div>
                </div>
            </Popup>
            <div className={`post_${id}`}>
                <div className="post_header">
                    <h1 className="post_title">{title}</h1>
                    {isLoggedIn && <Popup trigger={<button className="delete_button">🗑️</button>}>
                        {(close) => (
                            <>
                            <h1 className="confirmation_header">Are you sure you want to delete?</h1>
                            <button className="delete_confirm"
                                onClick={async (e) =>{
                                    e.preventDefault();
                                    try {
                                        const res = await axios.post('http://localhost:3030/deletepost', {
                                            id
                                        });

                                        const success = res.data.success;

                                        if (success) {
                                            close();
                                            setDeletionFlag(true);
                                        }
                                        else {
                                            alert("Deletion Unsuccessful");
                                        }
                                        
                                    } catch (err) {
                                        console.error("Deletion failed:", err.response?.data || err.message)
                                    }
                                    alert("Post Deleted: id#", id);

                            }}>Confirm</button>
                            <button className="delete_cancel" onClick={() => close()}>Cancel</button>
                            </>
                        )}   
                            
                    </Popup>}
                </div>
                <div className="post_picture">
                    {thumbnail && <img 
                        className="post_thumbnail"
                        src={`${thumbnail}`}
                        alt={`Thumbnail for post ${id}`}
                    />}
                </div>
                <div className={`post_body`}>
                    <p className={`post_content`}>{content}</p>
                </div>
            </div>
        </div>
        
    );
}

export default Post;