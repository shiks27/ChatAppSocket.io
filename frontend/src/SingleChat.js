import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './Components/config/ChatLogic';
import ProfileModel from './Components/Miscellanous/ProfileModel';
import UpdateGroupChatModel from './Components/Miscellanous/UpdateGroupChatModel';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import Lottie from "react-lottie";
import animationData from "./Animations/typing.json"
import io from 'socket.io-client';
const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            console.log("messages", messages);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to send the error message",
                status: "Error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on("Message Received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    })
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("newMessage", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };


    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }
    return (
        <div style={{height:'90%',width:'100%'}}>
            {selectedChat ? (
                <>
                    <Text fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        width="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center">
                        <IconButton display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")} />
                        {!selectedChat.isGroupChat ?
                            (<>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModel
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>)}
                    </Text>
                    <Box
                        display="flex" flexDirection="column" justifyContent="flex-end" padding={3} bg="#E8E8E8"
                        width="100%" height="100%" borderRadius="lg" overflowY="hidden">
                        {loading ? (<Spinner size="xl"
                            width="20%"
                            height="20%"
                            alignSelf="center"
                            margin="auto" />) :
                            (<div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>)}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? (<div>
                                <Lottie
                                    options={defaultOptions}
                                    // height={50}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                /></div>) : (<></>)}

                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder='Enter a Message...'
                                onChange={typingHandler}
                                value={newMessage} />
                        </FormControl>
                    </Box>
                </>) :
                (<Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Text fontSize="2xl" paddingBottom={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>)
            }
        </div >
    )
}

export default SingleChat
