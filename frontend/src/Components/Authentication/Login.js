import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useToast, VStack, InputRightElement, FormControl, FormLabel, Input, Button, InputGroup } from '@chakra-ui/react';

const Login = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleClick = () => setShow(!show);
    const toast = useToast();
    const history = useHistory();
    const loginHandler = async () => {
        setLoading(true);
        if (!email || !password) {
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

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user/login", { email, password }, config);
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }
    return (
        <VStack spacing={'5px'}>
            <FormControl id='email' isRequired>
                <FormLabel >Email Address</FormLabel>
                <Input placeholder='Enter Your E-mail ID' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel >Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme='blue' variant='solid' width={'100%'} style={{ marginTop: 15 }} isLoading={loading} onClick={loginHandler}>
                Login
            </Button>
            <Button colorScheme='pink' variant='solid' width={'100%'} style={{ marginTop: 15 }} onClick={() => {
                setEmail("123@gmail.com")
                setPassword("1234")
            }}>
                Login via Guest User
            </Button>
        </VStack>
    )
}

export default Login
