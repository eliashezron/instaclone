import React, {useState, useEffect} from 'react'
import './Posts.css'
import Avatar from "@material-ui/core/Avatar"
import {db} from './firebase'
import firebase from "firebase"

function Posts({postsId,user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState([])
    
    useEffect(() => {
        let unsubscribe = function()
        {if(postsId){
            unsubscribe= db
            .collection("posts")
            .doc(postsId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapShot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }}
        return () =>{
            unsubscribe()
        }
    },[postsId])

    const postComment = (event) =>{
        event.preventDefault()

        db.collection("posts")
        .doc(postsId)
        .collection("comments")
        .add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="posts">
            <div className="post_header">
            <Avatar
            className="posts_avatar"
            src="/static/images/avatar/1.jpg"
            alt="eliashezron"
            />
            <h3>{username}</h3>
            {/* header-avatar-username */}     
            </div>
       

        <img className="posts_image" 
        src={imageUrl}
        alt=""/>
            {/* image */}
        <h4 className="posts_text"><strong>{username}</strong>
        {caption}</h4>
        <div className="post__comments">
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
        {user && (
          <form className ="posts_commentbox">
        <input
              className="post__input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button
              disabled={!comment}
              className="post__button"
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
        </form>
        )}
        
        </div>
    )
}

export default Posts
