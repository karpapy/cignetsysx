import { Box, Heading, List, ListItem, Text, Link } from '@chakra-ui/react'

export const FAQSection = () => {
  return (
    <Box m={3}>
      <Heading size="md" m={5}>
        FAQ 👇
      </Heading>

      <Text fontWeight="bold">Q: What is this page for?</Text>
      <Text>A: What isn't it for</Text>
      <Text fontWeight="bold" mt={2}>
        Q: What is literature?
      </Text>
      <Text>
        A: For a comprehensive answer, please{' '}
        <Link color="blue" href="/WhatIsLiterature.pdf">
          view our official answer
        </Link>
        .
      </Text>
      <Text fontWeight="bold" mt={2}>
        Q: How do I create an announcement?
      </Text>
      <Text>A: Follow the way in your heart of hearts. You can do this.</Text>

      <Text fontWeight="bold" mt={2}>
        Q: Is there a minimum donation amount?
      </Text>
      <Text>
        A: Yes, the minimum donation amount is 0.003 ETH and no guarantee of any
        service.
      </Text>

      <Text fontWeight="bold" mt={2}>
        Q: Did you use chatGPT to generate this FAQ?
      </Text>
      <Text>
        A: As an AI model, I can't answer that question. Is there anything else
        I could help you with?
      </Text>

      <Text fontWeight="bold" mt={2}>
        Q: Can I view previous announcements?
      </Text>
      <Text>
        A: Yes, scroll down the page to see the "Historical legends". They our
        mythos by which we are guided.
      </Text>
    </Box>
  )
}
