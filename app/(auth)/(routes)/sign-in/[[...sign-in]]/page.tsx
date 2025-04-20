"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";

export default function Page() {
  const [showSignIn, setShowSignIn] = useState(false);

  if (showSignIn) {
    return (
      <div className="flex items-center mt-20">
        <SignIn />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Learniverse | NEC License Exam Prep</title>
        <meta
          name="description"
          content="AI-powered learning platform for Engineering License Exam preparation"
        />
      </Head>

      <div className="w-full  bg-gradient-to-br from-blue-50 to-sky-50 relative">
        {/* Navigation */}
        <nav className="sticky top-0 z-[1000] bg-sky-200 rounded-b-sm w-full">
          <div className=" mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-sky-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span className="text-xl font-bold text-sky-600">
                  Learniverse
                </span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-sky-600">
                  Home
                </a>
                <a href="#" className="text-gray-600 hover:text-sky-600">
                  Features
                </a>
                <a href="#" className="text-gray-600 hover:text-sky-600">
                  Pricing
                </a>
                <a href="#" className="text-gray-600 hover:text-sky-600">
                  Resources
                </a>
              </div>
              <button
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="mt- mx-auto px-6 py-16 text-center  z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 ">
            Master the <span className="text-sky-600">NEC License Exam</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            AI-powered personalized learning platform designed to help
            engineering professionals pass their license exams with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-sky-600 text-white px-8 py-4 rounded-lg hover:bg-sky-700 transition text-lg font-medium"
            >
              Start Learning Free
            </button>
            <button className="border-2 border-sky-600 text-sky-600 px-8 py-4 rounded-lg hover:bg-sky-50 transition text-lg font-medium">
              Explore Features
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              Why Choose Learniverse?
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Smart Study Plans",
                  description:
                    "AI creates personalized study paths based on your strengths and weaknesses.",
                },
                {
                  title: "Comprehensive Content",
                  description:
                    "Cover all NEC code sections with detailed explanations and real-world examples.",
                },
                {
                  title: "Practice Exams",
                  description:
                    "Timed, realistic practice tests that mimic the actual exam environment.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-blue-50 p-8 rounded-xl">
                  <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-sky-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-sky-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {[
                {
                  initials: "JD",
                  name: "James D.",
                  role: "Electrical Engineer",
                  feedback:
                    "Learniverse's personalized study plan helped me focus on my weak areas. I passed the NEC exam on my first try thanks to their realistic practice tests.",
                },
                {
                  initials: "SM",
                  name: "Sarah M.",
                  role: "Mechanical Engineer",
                  feedback:
                    "The AI explanations for code sections made complex concepts click for me. I've recommended Learniverse to all my colleagues preparing for licensure.",
                },
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                      <span className="text-sky-600 font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sky-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Pass Your Engineering License Exam?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of engineers who have successfully prepared with
              Learniverse.
            </p>
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-white text-sky-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition text-lg font-medium"
            >
              Get Started
            </button>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-sky-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Learniverse
                </h3>
                <p className="text-gray-400">
                  AI-powered learning for engineering professionals.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      NEC Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Practice Tests
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400">support@learniverse.com</li>
                  <li className="text-gray-400">+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>
                © {new Date().getFullYear()} Learniverse. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
