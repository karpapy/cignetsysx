import { Table, Thead, Tbody, Tr, Th, Td, Text, Link } from '@chakra-ui/react'

const toTwitterLink = (author) => {
  if (author[0] === '@') return `https://twitter.com/${author.slice(1)}`
  return `https://twitter.com/${author}`
}

export const PreviousAnnouncementTable = ({ announcements }) => {
  return (
    <Table variant="striped" colorScheme="gray" overflow="scroll">
      <Thead>
        <Tr>
          <Th>Announcement</Th>
          <Th>Author (alleged)</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {announcements.map((announcement, index) => (
          <Tr
            key={announcement.id}
            boxShadow={index === 0 ? '0 0 10px 5px #2bff00' : 'none'}
          >
            <Td>{announcement.announcement}</Td>
            <Td>
              {announcement.author === '' ? (
                <Text fontStyle="italic">anon</Text>
              ) : (
                <Link href={toTwitterLink(announcement.author)} color="blue">
                  {announcement.author}
                </Link>
              )}
            </Td>
            <Td>{announcement.created_at}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
