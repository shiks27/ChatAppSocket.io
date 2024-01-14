import React, { useState } from "react";
import {Box} from "@chakra-ui/layout";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/Miscellanous/SideDrawer";
import MyChats from "../MyChats";
import ChatBox from "../ChatBox";

const ChatPage = () => {
  const { user }= ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  return (
      <div style={{width:"100%"}}>
        {user && <SideDrawer/>}
        <Box display="flex" justifyContent="space-between" width="100%" height="91.5vh" p="10px">
          {user && 
          <MyChats fetchAgain={fetchAgain} />}
          {user &&
           <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
      </div>
  );
};

export default ChatPage;
