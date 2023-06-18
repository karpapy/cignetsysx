import 'react-cmdk/dist/cmdk.css'
import CommandPalette, { filterItems, getItemIndex } from 'react-cmdk'
import { useState, useEffect } from 'react'
import { Box, Heading, Image } from '@chakra-ui/react'

const FunkyHome = ({ display, image }) => {
  return (
    <Box display="flex" alignItems="center" width="100%">
      <Image mr={6} src={image} alt="Nod" maxH="50px" borderRadius="full" />
      <Heading>{display}</Heading>
    </Box>
  )
}

const CodePart = () => {
  return (
    <Box display="flex" alignItems="center" width="100%">
      <Image
        mr={6}
        src="/favicon.png"
        alt="Nod"
        maxH="50px"
        borderRadius="full"
      />
      <Heading>the code</Heading>
    </Box>
  )
}

const CommandBarMain = () => {
  const [page, setPage] = useState('root')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const filteredItems = filterItems(
    [
      {
        heading: 'CIGNETSYS',
        id: 'home',
        items: [
          {
            id: 'CIGNET origin',
            children: FunkyHome({ display: 'origin.', image: 'bataille.jpeg' }),
            href: '/',
          },
          {
            id: 'ANNOUNCE!',
            children: FunkyHome({ display: 'ANNOUNCE!', image: 'eye.gif' }),
            href: '/announce',
          },
          {
            id: 'render',
            children: 'render',
            icon: 'BanknotesIcon',
            onClick: () => {
              alert('dude just click render')
            },
          },
        ],
      },
      {
        heading: 'Other',
        id: 'adv4nc3d hacking',
        items: [
          {
            id: 'the source the code',
            children: CodePart(),
            href: '#',
          },
          {
            id: 'stats',
            children: 'stats',
            icon: 'ChartPieIcon',
            href: '/stats',
          },
          {
            id: 'privacy-policy',
            children: 'Privacy policy',
            icon: 'LifebuoyIcon',
            href: 'https://www.fbi.gov/',
          },
          {
            id: 'log-out',
            children: 'Log out',
            icon: 'ArrowRightOnRectangleIcon',
            onClick: () => {
              alert('step away from the computer.')
            },
          },
        ],
      },
    ],
    search,
  )

  return (
    <CommandPalette
      onChangeSearch={setSearch}
      onChangeOpen={setOpen}
      search={search}
      isOpen={open}
      page={page}
    >
      <CommandPalette.Page id="root">
        {filteredItems.length ? (
          filteredItems.map((list) => (
            <CommandPalette.List key={list.id} heading={list.heading}>
              {list.items.map(({ id, ...rest }) => (
                <CommandPalette.ListItem
                  key={id}
                  index={getItemIndex(filteredItems, id)}
                  {...rest}
                />
              ))}
            </CommandPalette.List>
          ))
        ) : (
          <CommandPalette.FreeSearchAction />
        )}
      </CommandPalette.Page>
    </CommandPalette>
  )
}

export default CommandBarMain
