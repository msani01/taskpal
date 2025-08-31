import AddTaskComponent from '@/components/AddTasksComponents'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const page = () => {
  return (
    <section>
        <ProtectedRoute>
          <AddTaskComponent/>
        </ProtectedRoute>
    </section>
  )
}

export default page
