import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUserRoute, host, sendMessageRoute } from '../utils/APIRoutes';
import Contact from '../Components/Contact/Contact';
import Welcome from '../Components/Welcome/Welcome';
import ChatContainer from '../Components/ChatContainer/ChatContainer';
import loader from '../assets/loader.gif'
import {io} from 'socket.io-client'


const Chat = () => {
  const socket = useRef()
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState({})
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoad, setIsLoad] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoad(true);
    const timeoutId = setTimeout(() => {
      setIsLoad(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      setIsLoad(false);
    };
  }, []);

  useEffect(() => {

    const getCurrentUser = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true)
      }
    }

    getCurrentUser()
  }, []);


  useEffect(()=>{

    socket.current = io(host)
    socket.current.emit("add-user", currentUser._id,)

  },[currentUser])


  useEffect(() => {


    const getAllUsers = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUserRoute}/${currentUser._id}`)
          setContacts(data.data);
        }
        else {
          navigate("/avatar")
        }
      }
    }

    getAllUsers()

  }, [currentUser])




  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }


  return (
    
      isLoad ?
      <Container>
      <img src = { loader } alt = "loader" />
    </Container >
    : <Container>
  <div className="container">
    <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
    {
      isLoaded && currentChat === undefined ?
        <Welcome currentUser={currentUser} /> :
        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
    }

  </div>
</Container>
    
  )
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat