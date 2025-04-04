import { IoCallOutline } from "react-icons/io5";
import { Input } from "../../components/Input";
import { IoIosSend } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { io} from "socket.io-client"

export const Dashboard = () => {


  useEffect(() => {
    const storedUser = localStorage.getItem('user:detail');
    if (!storedUser) {
      console.error("No user details found in localStorage");
      return;
    }
  
    const loggedInUser = JSON.parse(storedUser);
    
    if (!loggedInUser?.id) {
      console.error("Invalid user ID:", loggedInUser);
      return;
    }
  
    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/conversation/${loggedInUser.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          console.error("Error fetching conversations:", res.status);
          return;
        }
  
        const resData = await res.json();
        setConversations(resData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
  
    fetchConversations();
  }, []);
  
  

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage]= useState('');
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  console.log('messages:>>', messages);

  useEffect(() => {
    setSocket(io('http://localhost:8080'))
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket?.emit('addUser', user?.id);

    socket?.on('getUsers', (users) => {
        console.log('activeUsers:>>', users);
    });

    // Use a single event listener
    const handleMessage = (data) => {
        console.log('Received message:', data);
        setMessages((prev) => ({
            ...prev,
            messages: [...prev.messages, { user: { id: data.senderId }, message: data.message }]
        }));
    };

    socket?.on('getMessage', handleMessage);

    return () => {
        socket.off('getUsers');
        socket.off('getMessage', handleMessage);
    };
}, [socket]);



  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const text = await res.text(); // Read response as text
    try {
      const resData = JSON.parse(text); // Attempt to parse JSON
      setMessages({ messages: resData, receiver, conversationId });
    } catch (error) {
      console.error("Invalid JSON response:", text);
    }
    
  };

  const [isSending, setIsSending] = useState(false); 

  const sendMessage = async (e) => {
      e.preventDefault();
      
      if (!message.trim() || isSending) return; 
  
      setIsSending(true); 
  
      const newMessage = {
          senderId: user?.id,
          receiverId: messages?.receiver?.receiverId,
          message,
          conversationId: messages?.conversationId
      };
  
      socket?.emit('sendMessage', newMessage);
  
      console.log('sendMessage >>', newMessage);

      setMessages((prev) => ({
          ...prev,
          messages: [...prev.messages, { user: { id: user?.id }, message }]
      }));
  
      setMessage(''); 
  
      try {
          const res = await fetch(`http://localhost:8000/api/message`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(newMessage)
          });
  
          const resData = await res.json();
          console.log('resData :>>', resData);
      } catch (error) {
          console.error("Error sending message:", error);
      }
  
      setIsSending(false); 
  };
  
  useEffect(() =>{
    messageRef?.current?.scrollIntoView({behaviour: 'smooth'})
  }, [messages?.messages])


  useEffect(() =>{
    const fetchUsers = async () =>{
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const resData = await res.json()
      setUsers(resData);
    }
    fetchUsers()
  }, [])

  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-[var(--secondary-color)] ">
        <div className="flex justify-center items-center my-8 mx-1o">
          <div className="border border-[var(--primary-color)] p-2 rounded-full"><img src="src/assets/user.jpg" alt="img" width={75} height={75} className="w-25 h-25 rounded-full object-cover" /></div>
          <div className="ml-4">
              <h3 className="text-xl">{user.fullName}</h3>
              <p className="text-sm font-light">{user.email}</p>
          </div>
        </div>
        <hr className="border border-gray-200" />
      <div>
        <div className="ml-14 mt-3">
          <div className="text-[var(--primary-color)] mb-2">Messages</div>
        <div>
          {
            conversations.length > 0 ?
            conversations.map(({conversationId, user}) => {
                return(
                  <><div className="flex items-center my-2 mx-3">
                  <div className="flex items-center cursor-pointer " onClick={() => fetchMessages(conversationId, user)} >
                    
                    <div className="border border-gray-500 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center">
                      <img src='src/assets/user.jpg' alt="img" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg">{user?.fullName}</h3>
                      <p className="text-sm font-light text-gray-450">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <hr className="border border-gray-200" /></>
        
                )
            }) : <div className=" text-lg font-semibold mt-24">No conversations</div>
          }
        </div>
        </div>
      </div>
        
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {
          messages?.receiver?.fullName && <div className="w-[75%] bg-[var(--secondary-color)] h-[80px] my-5 rounded-full flex items-center px-14" >
          <div ><img src="src/assets/user.jpg" alt="user" className="rounded-full" width={60} height={60} /></div>
          <div className=" ml-3">
          <h3 className="text-lg">{messages?.receiver?.fullName}</h3>
          <p className="text-sm font-light text-gray-600">online</p>
          </div>
          <IoCallOutline className="ml-auto text-xl" />
        </div>
        }
        
        <div className="h-[90%]  w-full overflow-y-scroll mt-2 shadow-sm">
          <div className="p-14">
            
            
            {
              messages?.messages?.length > 0 ? 
              messages.messages.map(({message, user:{ id } = {} }) => {
                return(
                  <>
                  <div className={` max-w-[40%]  rounded-b-xl  p-4  mb-2 ${id === user?.id ? ' bg-[var(--primary-color)] ml-auto rounded-tl-xl text-white' : 'bg-[var(--secondary-color)] rounded-tr-xl text-black'} `}>{message}</div>
                  <div ref={messageRef}></div>
                  </>
                )
                
              }) : <div className="text-center text-lg font-semibold mt-25"> Start Conversation</div>
            }
          </div>
        </div>
        {
          messages?.receiver?.fullName && <div className="p-4 w-full flex items-center">
          <Input placeholder="Type a message..." className="w-[75%]" value={message} onChange={(e) => setMessage(e.target.value)} inputClassName="p-4 shadow-m rounded-full bg-light focus:ring-0 focus:border-0 outline-none" />
          <IoIosSend className={`text-3xl text-[var(--primary-color)] ml-4 mt-2 cursor-pointer ${!message && 'pointer-events-none'} `} onClick={(e) => sendMessage(e)}  />
          <CiCirclePlus className={`text-3xl text-[var(--primary-color)] ml-2 mt-2 cursor-pointer ${!message && 'pointer-events-none'}` }/>

        </div>
        }
      </div>
      <div className="w-[25%] h-screen bg-[var(--secondary-color)] px-8 py-14 overflow-y-scroll">
        <div className="text-[var(--primary-color)] text-lg"> People</div>
        <div>
        {
            users.length > 0 ?
            users.map(({userId, user}) => {
                return(
                  <><div className="flex items-center my-2 mx-3">
                  <div className="flex items-center cursor-pointer " onClick={() => fetchMessages('new', user)} >
                    
                    <div className="border border-gray-500 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center">
                      <img src='src/assets/user.jpg' alt="img" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg">{user?.fullName}</h3>
                      <p className="text-sm font-light text-gray-450">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <hr className="border border-gray-200" /></>
        
                )
            }) : <div className=" text-lg font-semibold mt-24">No conversations</div>
          }
        </div>
      </div>
    </div>
  );
};
