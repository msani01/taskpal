"use client"
import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
import ProtectedRoute from './ProtectedRoute'

const CalendarPage = () => {
  return (
    <main>
      <ProtectedRoute>
        <Nav/>
        <div className='flex items-center justify-center min-h-screen text-3xl text-gray-800
         shadow-2xl shadow-gray-600 bg-gray-300'>
            Calendar Integration is Coming Soon!!!
        </div>
        <Footer/>
      </ProtectedRoute>
        
    </main>
  )
}

export default CalendarPage
