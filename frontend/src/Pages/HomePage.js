import React,{useEffect} from 'react'
import { Container, Box, Text ,Tabs,TabList,Tab,TabPanels,TabPanel} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/SignUp';

function HomePage() {
  const history=useHistory();
    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("userInfo"));

        if(user){
            history.push("/chats");
        }
    },[history])
  return (
    <Container maxW='xl' centerContent>
      <Box display='flex' justifyContent='center' p={3} bg={'white'} width='100%' margin="40px 0px 15px 0px" borderRadius='lg'
        borderWidth="1px">
        <Text fontSize="4xl" fontFamily="Work sans">Talk-A-Tive</Text>
      </Box>
      <Box bg="white" w='100%' p={4} borderRadius="lg" borderWidth="1px" color="black" >
        <Tabs variant='soft-rounded' >
          <TabList mb={'1em'}>
            <Tab width={'50%'}>Log In</Tab>
            <Tab width={'50%'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
