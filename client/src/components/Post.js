
import './styles/Post.css';

function Post({id, title, content, thumbnail}) {

    

    return(
        <div className="post">
            <div className={`post_${id}`}>
                <div className="post_header">
                    <h1 className="post_title">{title}</h1>
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