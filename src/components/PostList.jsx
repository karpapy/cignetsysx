import React from 'react'
import { Box, Flex, Button } from '@chakra-ui/react'
import { Pack } from './Pack'
import { CoolButton } from './CoolButton'
import Link from 'next/link'

export const PostList = ({ posts }) => {
  return (
    <Box>
      {posts.map((post, index) => (
        <Box
          key={index}
          bgColor="gray.100"
          p={2}
          mt={3}
          boxShadow={index === 0 ? '0 0 10px 5px #2bff00' : 'none'}
        >
          <Pack cignum={post.cignum} message={post.message} />
          <Flex justify="space-between">
            <CoolButton>{post.address}</CoolButton>
            <CoolButton>
              <Link href={'/cigforum/p/' + post.id}>view post</Link>
            </CoolButton>
            {post.parent_id && (
              <CoolButton>
                <Link href={`/cigforum/p/${post.parent_id}`}>
                  view parent post
                </Link>
              </CoolButton>
            )}
          </Flex>
        </Box>
      ))}
    </Box>
  )
}
