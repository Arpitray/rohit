"use client"

import React, { useState } from 'react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: Replace with real submission logic (API/email). Keep form reset for now.
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <>
      <div
        id='contact'
        className='min-h-screen z-70 relative bg-[#0D0D0D] text-white p-3 sm:p-6'
        data-section='contact'
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dsjjdnife/image/upload/v1758206104/rohit_t9i2jr.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* strips should sit above the background */}
        <div className="strip1 leading-12 lg:leading-none relative z-20 mt-22 lg:mt-0 flex flex-col sm:flex-row items-center justify-around h-auto sm:h-32 py-4 sm:py-0 text-2xl sm:text-lg md:text-2xl lg:text-3xl font-['clashB'] space-y-2 sm:space-y-0">
          <a href="mailto:rayarpit72@gmail.com" data-project-link="mailto:rayarpit72@gmail.com" className="break-all text-center">rayarpit72@gmail.com</a>
          <a href="https://maps.google.com/?q=Bangalore+Karnataka" data-project-link="https://maps.google.com/?q=Bangalore+Karnataka" className="text-center">Karnataka, Bangalore India</a>
          <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" data-project-link="https://instagram.com/yourhandle" className="text-center">Instagram</a>
          <a href="https://www.linkedin.com/in/rohit-bharude-12594121a/" target="_blank" rel="noreferrer" data-project-link="https://www.linkedin.com/in/rohit-bharude-12594121a/" className="text-center">LinkedIn</a>
        </div>

        <div className="strip2 relative z-20 flex lg:mt-152 mt-99  items-end justify-center  py-4 text-lg sm:text-2xl md:text-3xl font-['clashB']">
          <a href="">Raw@2025</a>
        </div>
        {/* Mobile-only PNG positioned near the bottom (centered). Hidden on md+ so desktop is unchanged */}
        <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758206104/rohit_t9i2jr.png"
          alt="raw-logo"
          loading="lazy"
          className="md:hidden absolute left-1/2 transform -translate-x-1/2 bottom-22 w-3/4 max-w-xs pointer-events-none z-30"
        />
      </div>
    </>
  )
}

export default Contact
