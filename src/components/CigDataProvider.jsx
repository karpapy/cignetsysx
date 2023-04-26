import { getRenderData } from '@/lib/loader'
import React, { createContext, useContext, useState, useEffect } from 'react'

const CigDataContext = createContext()

export const CigDataProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const meta = await getRenderData()
      setMetadata(meta)
    }

    if (metadata === null) {
      fetchData()
    }
  }, [metadata])

  return (
    <CigDataContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </CigDataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(CigDataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a CigDataProvider')
  }
  return context
}
