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
    // For now just log the values. Replace with real submission logic later.
    console.log('Contact form submitted', form)
    alert('Thanks — your message was received (demo).')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <>
      <div
        id='contact'
        className='min-h-screen z-70 relative bg-[#0D0D0D] text-white p-6'
        data-section='contact'
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dsjjdnife/image/upload/v1758206104/rohit_t9i2jr.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* strips should sit above the background */}
        <div className="strip1 relative z-20 flex items-center justify-around h-32 text-3xl font-['clashB']">
          <a href="mailto:rayarpit72@gmail.com" data-project-link="mailto:rayarpit72@gmail.com">rayarpit72@gmail.com</a>
          <a href="https://maps.google.com/?q=Bangalore+Karnataka" data-project-link="https://maps.google.com/?q=Bangalore+Karnataka">Karnataka, Bangalore India</a>
          <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" data-project-link="https://instagram.com/yourhandle">Instagram</a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" data-project-link="https://linkedin.com/in/yourprofile">LinkedIn</a>
        </div>

        <div className="strip2 relative z-20 flex items-end justify-around mt-162 text-3xl font-['clashB']">
          <a href="">Raw.@2025</a>
        </div>
      </div>
    </>
  )
}

export default Contact
