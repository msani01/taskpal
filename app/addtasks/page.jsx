"use server"
import { auth } from '@/auth'
import AddTasksComponents from '@/components/AddTasksComponents'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }
  return (
    <main>
      <AddTasksComponents session={session}/>
    </main>
  )
}

export default page
