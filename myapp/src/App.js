import React,{useState, useEffect} from 'react';

import './App.css';
import Posts from './Posts.js'
import {db, auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core'
import ImageUpload from './ImageUpload'
import InstagramEmbed from "react-instagram-embed"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "300px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}))

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  

  const [posts, setPosts]= useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn]=useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


useEffect(()=>{
  const unsubscribe= auth.onAuthStateChanged((authUser) =>{
    if (authUser) {
      // user is logged in...
      console.log(authUser);
      setUser(authUser);

      if (authUser.displayName) {
        // dont update username
      } else {
        return authUser.updateProfile({
          displayName: username,
        });
      }
    } else {
      setUser(null);
    }
  });

  return () => {
    // perform some clean up
    unsubscribe();
  };
}, [user, username]);
  


//  runs a piece of code based on a specific condtion
useEffect(() => {
  db.collection("posts")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) =>
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, posts: doc.data() })))
    );
}, []);

  const signUp =(event)=>{
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))

    setOpen(false)
  }

  const signIn =(event)=>{
    event.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">
      
      <Modal
      open={open}
      onClose={ ()=> setOpen(false)}>

      <div style ={modalStyle} className={classes.paper}>
      <form className="app_signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={signUp}>signUp</Button>
          </form>
      </div>

      </Modal>

      <Modal
      open={openSignIn}
      onClose={ ()=> setOpenSignIn(false)}>

      <div style ={modalStyle} className={classes.paper}>
      <form className="app_signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            {/* <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            /> */}
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={signIn}>signIn</Button>
          </form>
      </div>

      </Modal>

           
      
      {/* header */}
      <div className ="app_header">
        <img
        className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
         {user ? (
        <Button onClick ={()=> auth.signOut()}>LogOut</Button>
      ):(
        <div className="login_container">
        <Button onClick={()=> setOpenSignIn(true)}>sign in</Button>
        <Button onClick={()=> setOpen(true)}>sign up</Button>
        </div>
        )};
      </div>
     
        
     
      



      {/* <Posts username="starhezron" caption="wow it works" imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlbaDjeGEvNo1RuRkyaiKxh1BpfDI32rtphw&usqp=CAU"/>
      <Posts username="petit" caption="dope" />
      <Posts username="samuel" caption="does it work>" />
       */}
      {/* posts */}
      <div className="app_posts">
      <div className="app_postsleft">
 {
        posts.map(({id, posts})=> (
          <Posts key={id} postsId={id} user={user} username={posts.username}
          caption={posts.caption}
          imageUrl={posts.imageUrl} />
        ))
      } 
      </div>
      <div className="app_postsright">
 <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
      </div>
      
      </div>
     
      
      {user?.displayName ?(
      <ImageUpload username={user.displayName}/>
    ):(
      <h3>Sorry you need to Login to Upload</h3>
    )}
    
    
      </div>
  );
}

export default App;
