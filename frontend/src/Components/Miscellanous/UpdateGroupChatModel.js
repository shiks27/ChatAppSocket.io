import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton, Button, useToast, Box, FormControl, Input, Spinner
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import UserListItem from '../UserAvatar/UserListItem'
import axios from 'axios'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import ScrollableChat from '../../ScrollableChat'
import { config } from 'dotenv'
const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async (user1) => {
        console.log(user1);
        console.log(selectedChat._id);
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
          toast({
            title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          fetchMessages();
          setFetchAgain(!fetchAgain);
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
        setGroupChatName("");
      };
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setRenameLoading(false)
        }
        setGroupChatName("")
    }
    
    const handleAddUser =async(user1)=>{
        if(selectedChat.users.find((u)=> u._id === user1._id)){
            toast({
                title: "User Already in Group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admin can add someone!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try{
            setLoading(true);

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data}=await axios.put(`/api/chat/groupadd`,{
                chatId:selectedChat._id,
                userId: user1._id,
            },
            config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        }catch(error){
            toast({
                title: "Error Occured!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }


    return (
        <div>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody  d="flex" flexDir="column" alignItems="center">
                        <Box width="100%" display="flex" flexWrap="wrap" paddingBottom={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem 
                                key={u._id}
                                user={u} 
                                admin={selectedChat.groupAdmin}  
                                handleFunction={() => handleRemove(u)} 
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)} />

                            <Button variant="solid"
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}>Update</Button>

                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add User to a Group' mb={3} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? (<Spinner size="lg" />)
                            : (searchResult?.map((user) =>
                            (<UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)} />
                            ))
                            )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={() => handleRemove(user)} mr={3} >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroupChatModel
