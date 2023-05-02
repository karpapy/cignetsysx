import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'

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
        {announcements.map((announcement) => (
          <Tr key={announcement.id}>
            <Td>{announcement.announcement}</Td>
            <Td>{announcement.author}</Td>
            <Td>{announcement.created_at}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
