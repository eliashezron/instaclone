import { Button } from '@material-ui/core'
import React,{useState} from 'react'
import {storage, db} from './firebase'
import firebase from "firebase"
import './ImageUpload.css'


function ImageUpload({username}) {
    const[caption, setCaption]= useState('')
    const[image, setImage]=useState('')
    const[progress, setProgress]=useState('')

    const handleChange=(event)=>{
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }
    const handleUpload=()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
         
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                // progress function...
                const progress= Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                  setProgress(progress);
                
            },
            (error)=>{
                console.log(error)
                alert(error.message)
            },
             ()=>{
                //  complete function
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url =>{
                    // post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption :caption,
                        imageUrl:url,
                        username
                    })
                    setProgress(0)
                    setCaption("")
                    setImage(null)
                })
             }
        )
    } 

    return (
        <div className="imageupload">
            {/* caption input */}
            {/* upload fom file */}
            {/* Post button */}
            <progress className="imageupload_progress" value={progress} max="100"/>
            <input type='text'
                placeholder="Enter a caption..."
                value={caption}
                onChange={(event)=> setCaption(event.target.value)}
            />
            <input type='file' onChange={handleChange}/>
            <Button onClick= {handleUpload} >
            upload
            </Button>

        </div>
    )
}

export default ImageUpload
