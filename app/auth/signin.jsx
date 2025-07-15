import React from 'react'

const signin = () => {
  return (
    <main className="min-h-dvh p-3 md:p-10 space-y-5">
      <h1 className="text-center font-bold md:text-3xl text-xl text-gray-700">
        Sign in to your account to continue</h1>
      <div className="flex items-center justify-center">
        <div className="space-y-10 max-md:w-full md:w-xl">
         
          <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
       <button className="border flex items-center justify-center gap-2 bg-blue-600 text-white
        py-4 rounded-full text-xl hover:bg-blue-700 transition-all w-full">
            <p>Sign In with Google</p>
            <FaGoogle />
          </button>
      
    </form>
          <button className="border flex items-center justify-center gap-2 bg-blue-600 text-white 
          py-4 rounded-full text-xl hover:bg-blue-700 transition-all w-full">
            <p>Sign In with Github</p>
            <FaGithub />
          </button>
          <button className="border flex items-center justify-center gap-2 bg-blue-600 text-white 
          py-4 rounded-full text-xl hover:bg-blue-700 transition-all w-full">
            <p>Sign In with Facebook</p>
            <FaFacebookF />
          </button>
        </div>
      </div>
      <p className="text-center text-gray-700 mt-5">
        By accessing your account, you agree to comply with our <span className="underline">Privacy Policy</span>,
        and <span className="underline">Terms of Use</span>.
      </p>
    </main>
  )
}

export default signin
