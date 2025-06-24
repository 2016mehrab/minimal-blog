import React from 'react'
import { Spinner } from './ui/shadcn-io/spinner'

const Loader = () => {
  return (

      <div className="flex w-full h-screen items-center justify-center gap-4 bg-secondary">
        <Spinner />
      </div>
  )
}

export default Loader