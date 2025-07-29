import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = () => {
  return (
    <div>
      <Nav/>
    <div className="bg-white text-gray-800">
      {/* Fisrt Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto 
      px-4 py-16 gap-10 bg-gradient-to-r from-gray-50 to-blue-100">
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left p-5">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Stay Focused. <br /> Get More Done.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage your tasks, track your projects, and boost productivity
            all in one simple app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="auth/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Get Started for Free
            </Link>
            <Link
              href="auth/signin"
              className="text-blue-600 px-6 py-3 rounded-md text-sm font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Side Image */}
        <div className="md:w-1/2">
          <Image
            src="/calendarIntegration.jpg"
            alt="App Preview"
            height={500}
            width={500}
            className="h-62rem w-62rem rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose TaskPal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">✅ Easy Task Management</h3>
              <p className="text-gray-600">
                Create, edit, and organize tasks in seconds. Stay on top of your work effortlessly.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">📆 Calendar View</h3>
              <p className="text-gray-600">
                Visualize your tasks by day, week, or month. Never miss a deadline again.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">👥 Team Collaboration</h3>
              <p className="text-gray-600">
                Assign tasks, leave comments, and share updates with your team in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-gray-800 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your day?</h2>
        <p className="mb-6 text-lg">Sign up now and start your productivity journey for free.</p>
        <Link
          href="auth/signin"
          className="bg-white text-blue-600 px-6 py-3 rounded-md text-sm font-medium
           hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          Get Started
        </Link>
      </section>
    </div>
    <Footer/>
    </div>

  );
}

   
export default page
