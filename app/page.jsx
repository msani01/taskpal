import React from 'react'

const page = () => {
  return (
    <main className='bg-white min-h-dvh'>
     <div className='pt-50 max-md:pt-32
     bg-gradient-to-r from-gray-50 to-blue-100'>
      <h1 className=' text-gray-800 md:text-5xl text-3xl text-center lg:text-7xl font-bold
        flex px-3 items-center justify-center'>
        Stay Focused. Get More Done.
      </h1>
      <p className='text-gray-500 flex justify-center items-center px-3 text-center lg:text-2xl'>
        "A smart task management system to help you organize your life and hit your goals — stress-free."
      </p>
      
      <div className='h-1/2 w-full flex justify-center items-center'>
        <img src="/dashboardPreview.jpg" alt="image" width={800} height={800} className='flex justify-center
       items-center h-1/2 w-1/2 pt-5'/>
      </div>
     </div>
     <div className='grid grid-cols-3 p-5 gap-5'>
      <div >
        <img src="/taskUi.jpg" alt="UI" width={500} height={500} className='h-1/2 w-1/2' />
      </div>
      <div>
        <img src="/taskUi.jpg" alt="UI" width={500} height={500} className='h-1/2 w-1/2' />
      </div>
      <div>
        <img src="/taskUi.jpg" alt="UI" width={500} height={500} className='h-1/2 w-1/2' />
      </div>
     </div>
     
      
    </main>
  )
}

export default page
