
import { useEffect, useState, useRef } from 'react';
import './styles/Post.css';

function Post({id, title, content, thumbnail}) {
    const [isOpen, setIsOpen] = useState(false);
    const postBodyRef = useRef(null);
    const showButtonRef = useRef(null);

    useEffect(() => {
        if (postBodyRef.current) {
            if (isOpen) {
                postBodyRef.current.style.display = 'block';
                postBodyRef.current.style.height = 'fit-content';
            } else {
                postBodyRef.current.style.display = 'none';
                postBodyRef.current.style.height = '0';
            }
        }
    }, [isOpen]);

    const toggle = () => {
        setIsOpen(!isOpen);
        if (showButtonRef.current){
            showButtonRef.current.style.transform = !isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    };
    

    return(
        <div className="post" tabIndex={`0`}>
            <div className={`post_${id}`}>
                <div className="post_header">
                    <h1 className="post_title">{title}</h1>
                </div>
                <div className="post_picture">
                    {thumbnail && <img 
                        className="post_thumbnail"
                        src={`${thumbnail}`}
                        alt={`Thumbnail for post ${id}`}
                    />}
                </div>
                <div className={`post_body`} ref={postBodyRef}>
                    <p className={`post_content`}>{content}</p>
                </div>
            </div>
            <button className="showButton" ref={showButtonRef} onClick={toggle}>↓</button>
        </div>
        
    );
}

export default Post;