import React,{useState,useEffect, useRef} from 'react'
import styled from 'styled-components';
import Logout from '../Logout/Logout';
import ChatInput from '../ChatInput/ChatInput';
import axios from 'axios';
import { getMessagesRoute, sendMessageRoute } from '../../utils/APIRoutes';
import { v4 as uuidv4 } from "uuid";




const ChatContainer = ({ currentChat , currentUser, socket }) => {

  const [messages,setMessages] = useState([])
  const [arrivalMsg,setArrivalMsg] = useState(null)
  const scrollRef = useRef()



  useEffect(()=>{
   const getChat = async() =>{
    if(currentChat){
      const response = await axios.post(getMessagesRoute,{
        from:currentUser._id,
        to:currentChat._id
      })
      setMessages(response.data)
    }
 }
  
   getChat() 
  },[currentChat])

     

    const handleSendMessage = async(message) =>{
       const response= await axios.post(sendMessageRoute,{
          from:currentUser._id,
          to:currentChat._id,
          message:message
        })
        socket.current.emit("send-msg",{
          to:currentChat._id,
          from:currentUser._id,
          message: message
        })

        const msgs = [...messages]
        msgs.push({fromSelf:true, message:message})
        setMessages(msgs)
    }

    useEffect(()=>{
      if (socket.current){
        socket.current.on("msg-recieve",(msg)=>{
          setArrivalMsg({
            fromSelf:false,
            message:msg
          })
        })
      }
    })

    useEffect(()=>{
      arrivalMsg && setMessages((prev)=>[...prev, arrivalMsg])
    },[arrivalMsg])

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
        {
            currentChat  && (
            <Container>
                <div className="chat-header">
                    <div className="user-details">
                        <div className="avatar">
                            <img src={currentChat.AvtarImage} alt="avtarimage" />
                        </div>
                        <div className="username">
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                    <Logout />
                </div>
                <div className="chat-messages">
                  {
                    messages.map((message)=>{
                      return(
                        <div ref={scrollRef} key={uuidv4()}>
                          <div className={`message ${message.fromSelf?"sended":"recieved"}`}>
                            <div className="content">
                              <p>{message.message}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <ChatInput handleSendMsg={handleSendMessage} />
            </Container>
        )
    }
 </>
  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer