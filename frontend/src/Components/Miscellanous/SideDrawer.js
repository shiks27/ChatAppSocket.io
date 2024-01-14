import { Button, Tooltip, Text, Box, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDisclosure } from '@chakra-ui/react';
import ChatLoading from '../../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import axios from "axios";
import { getSender } from '../config/ChatLogic';
import NotificationBadge from "react-notification-badge";
import { Effect } from 'react-notification-badge';
const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user ,setSelectedChat,chats,setChats,notification,setNotification} = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();
    // console.log("test",user);
    const toast = useToast();
    const handleSearch =async() => {
        setLoadingChat(true);
        if (!search) {
            toast({
                title: "Please Enter Something in Search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try{
            setLoading(true);
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data}=await axios.get(`/api/user?search=${search}`,config);
            // console.log("data-->",JSON.stringify(data)); Accurate
            setLoading(false);
            setSearchResult(data);
        }catch(error){
            toast({
                title: "Error Occured!",
                description:"Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
    }
    const accessChat=async(userId)=>{
        try{
            setLoadingChat(true);
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };
            //{data}= for destructuring the data
            const {data}= await axios.post("/api/chat",{userId},config);
            if(!chats.find((c)=>c._id===data._id))setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch(error){
            toast({
                title: "Error in Fetching the Chat!",
                description:"Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
    }
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };
    return (
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px">
                <Tooltip label="Search Users to Chat"
                    hasArrow
                    placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fas fa-search" />
                        <Text d={{ base: "none", md: "flex" }} px='4'>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work-sans">Talk-A-tive</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif)=>(
                                <MenuItem key={notif._id} onClick={()=>{setSelectedChat(notif.chat);
                                setNotification(notification.filter((n)=>n!==notif))
                                }}>
                                    {notif.chat.isGroupChat ? 
                                    `New Message ${notif.chat.chatName}`:
                                    `New Message ${getSender(user,notif.chat.users)}`}
                                </MenuItem>

                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
                        <DrawerBody>
                            <Box display='flex' pb={2}>
                                <Input
                                    placeholder="Search by name or email"
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                                <Button onClick={handleSearch}>Go</Button>
                            </Box>
                            {loading?(<ChatLoading/>):(
                              //   console.log(JSON.stringify(searchResult))
                                searchResult?.map((user)=>(
                                    <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user._id)}/>
                                ))
                            )}
                           {loadingChat && <Spinner ml="auto" d="flex"/>}
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </div>
    );
}

export default SideDrawer
