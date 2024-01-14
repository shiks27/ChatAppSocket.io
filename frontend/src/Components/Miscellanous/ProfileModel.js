import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image, useDisclosure } from '@chakra-ui/react'
import React, { Children } from 'react'
import { Modal,ModalOverlay,ModalHeader,ModalCloseButton,ModalBody,ModalFooter,Button,ModalContent } from '@chakra-ui/react';
const ProfileModel = ({user,children}) => {
  const {isOpen,onOpen,onClose}=useDisclosure();
  return (
    <div>
      {
        children?(<span onClick={onOpen}>{children}</span>
        ):(<IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>)
      }
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">
            {user.name}
           </ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
           <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name}/>
          </ModalBody>

          <ModalFooter >
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModel
