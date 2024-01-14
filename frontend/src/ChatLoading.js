import React from 'react'
import { Stack,Skeleton } from '@chakra-ui/react'
function ChatLoading() {
    return (
        <div>
            <Stack>
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
                <Skeleton height='40px' />
            </Stack>
        </div>
    )
}

export default ChatLoading
