import React from 'react'

export default function layout({children}) {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>{children}</div>
  )
}
