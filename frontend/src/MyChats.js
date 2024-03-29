import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from "axios";
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { useToast } from '@chakra-ui/react';
import { getSender } from './Components/config/ChatLogic';
import GroupChatModel from './Components/Miscellanous/GroupChatModel';
const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();
  const fetchChats = async () => {
    console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log("check---------------", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      height="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work-sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center">
        My Chats
        <GroupChatModel>
          <Button display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}>New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box display="flex"
        flexDirection="column"
        padding={3}
        background="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden">
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ?
                    getSender(loggedUser, chat.users) : (chat.chatName)}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (<ChatLoading />)}
      </Box>
    </Box>
  )
};

export default MyChats;
