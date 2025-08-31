"use client"
import CalendarPage from '@/components/CalendarPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const page = () => {
  return (
    <div className='bg-white'>
      <ProtectedRoute>
        <CalendarPage/>
      </ProtectedRoute>
    </div>
  )
}

export default page
