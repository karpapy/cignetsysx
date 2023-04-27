import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Heading,
  Select,
  Text,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { useData } from './CigDataProvider'

const attributes = [
  'Brand',
  'Brand Line',
  'Eye Type',
  'Eye Color',
  'Background',
  'Certification',
  'Foil',
  'Tax Stamp',
]

export const Customize = ({
  filteredData,
  setFilteredData,
  selectedAttributes,
  setSelectedAttributes,
}) => {
  const { metadata } = useData()
  const filterData = useCallback(() => {
    if (filteredData === null) {
      setFilteredData(metadata)
      return
    }
    const filtered = metadata.filter((item) => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        if (value === 'random') return true
        const attr = item.attributes.find((a) => a.trait_type === key)
        return attr && attr.value === value
      })
    })
    if (filtered.length !== filteredData.length) setFilteredData(filtered)
  }, [filteredData, metadata, selectedAttributes, setFilteredData])

  useEffect(() => {
    filterData()
  }, [filterData, filteredData, metadata, selectedAttributes, setFilteredData])

  const uniqueAttributes =
    filteredData !== null
      ? filteredData.reduce((acc, curr) => {
          curr.attributes.forEach((attr) => {
            if (!acc[attr.trait_type]) {
              acc[attr.trait_type] = new Set()
            }
            acc[attr.trait_type].add(attr.value)
          })
          return acc
        }, {})
      : {}

  const orderedAttributeKeys = attributes.filter(
    (attr) => uniqueAttributes[attr],
  )

  const countFilteredOptions = (attr, value) => {
    return filteredData.reduce((count, item) => {
      const foundAttr = item.attributes.find(
        (a) => a.trait_type === attr && a.value === value,
      )
      return foundAttr ? count + 1 : count
    }, 0)
  }

  const handleChange = (event, attr) => {
    setSelectedAttributes({
      ...selectedAttributes,
      [attr]: event.target.value,
    })
  }

  const handleClear = () => {
    setSelectedAttributes({})
  }

  if (filteredData === null)
    return (
      <Box m={4} p={3} bg="white" borderRadius="lg" boxShadow="lg" w="100%">
        Loading data... <Spinner size="sm" />
      </Box>
    )

  return (
    <Box m={4} p={3} bg="white" borderRadius="lg" boxShadow="lg" w="100%">
      <Flex justifyContent="space-between" alignItems="center">
        Customize your cig!{' '}
        {filteredData.length !== 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            clear filters
          </Button>
        )}
      </Flex>
      {orderedAttributeKeys.map((attr, index) => {
        const values = uniqueAttributes[attr]
        return (
          <React.Fragment key={index}>
            <Heading size="sm" mt={4} mb={1}>
              {attr}
            </Heading>
            <Select
              value={selectedAttributes[attr] || 'random'}
              onChange={(e) => handleChange(e, attr)}
            >
              <option value="random">random</option>
              {Array.from(values).map((item, index) => {
                const count = countFilteredOptions(attr, item)
                return (
                  <option key={index} value={item}>
                    {item} ({count})
                  </option>
                )
              })}
            </Select>
          </React.Fragment>
        )
      })}
      {filteredData.length === 0 ? (
        <Text color="red" m={3}>
          whoa there sally cigs! aint no cigs with these exact attributes. Try
          again! 🤠
        </Text>
      ) : (
        <Text m={3}>
          There are {filteredData.length} cigs with these attributes. Wow!
        </Text>
      )}
    </Box>
  )
}
