import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const SignUp=()=> {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(true);
    const [cpshow, setcpShow] = useState(true);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history=useHistory();

    const handleClick = () => setShow(!show);
    const handleClick1 = () => setcpShow(!cpshow);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "chatapplicationmern")
            fetch("https://api.cloudinary.com/v1_1/chatapplicationmern/image/upload", {
                method: "POST",
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
        }
        else {
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    }
        const submitHandler = async () => {
            setLoading(true);
            if (!name || !email || !password || !confirmPassword) {
                toast({
                    title: 'Please Fill All the Fields',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                toast({
                    title: 'Passwords doesnt match',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                return;
            }
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };
                const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
                toast({
                    title: 'Registration Successful',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                localStorage.setItem("userInfo",JSON.stringify(data));
                setLoading(false);
                history.push("/chats");
            }
            catch (error) {
                toast({
                    title: 'Error Occured!',
                    description:error.response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
            }
        };
        return (
            <VStack spacing={'5px'}>
                <FormControl id='name' isRequired>
                    <FormLabel >Name</FormLabel>
                    <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
                </FormControl>

                <FormControl id='email' isRequired>
                    <FormLabel >Email Address</FormLabel>
                    <Input placeholder='Enter Your E-mail ID' onChange={(e) => setEmail(e.target.value)} />
                </FormControl>

                <FormControl id='password' isRequired>
                    <FormLabel >Password</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            placeholder='Enter password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id='cpassword' isRequired>
                    <FormLabel >Confirm Password</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={cpshow ? 'text' : 'password'}
                            placeholder='Confirm password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick1}>
                                {cpshow ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>Upload Your Picture</FormLabel>
                    <Input type='file'
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])} />
                </FormControl>

                <Button colorScheme='blue' variant='solid' width={'100%'} style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                    Submit
                </Button>
            </VStack>
        )
    }


export default SignUp;
