"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  return (
    <main className="w-full overflow-x-hidden">

      <nav className="fixed top-6 w-full flex justify-center z-50">
        <div className="w-[95%] max-w-6xl bg-[#888FED]/95 backdrop-blur rounded-full px-8 py-3 flex items-center justify-between shadow-lg">

          <div className="flex items-center gap-3 text-white font-bold text-lg">
            <Image src="/logo.png" alt="Flash logo" width={22} height={22} />
            Flash
          </div>

          <div className="hidden md:flex gap-10 text-white text-sm font-medium">
            <a href="#features" className="hover:opacity-80">Features</a>
            <a href="#how" className="hover:opacity-80">How</a>
            <a href="#other" className="hover:opacity-80">Other</a>
          </div>

          <Link
            href="/login"
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold"
          >
            Log In
          </Link>
        </div>
      </nav>


      <section className="min-h-screen bg-[#646DE8] text-white flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Transform the Way <br /> You Study !
          </h1>

          <p className="mt-4 opacity-90">
            The best way to study!
          </p>

          <Link
            href="/start"
            className="mt-8 inline-block bg-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Get Started →
          </Link>
        </motion.div>
      </section>


      <section id="features" className="py-24 bg-white text-center px-6">
        <h2 className="text-4xl font-bold text-[#646DE8]">
          Everything You Need to Master Everything
        </h2>

        <p className="text-gray-500 mt-3 mb-12">
          Flash helps students learn smarter with spaced repetition and simple flashcards.
        </p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Image
            src="/dashboard.png"
            alt="Dashboard preview"
            width={1000}
            height={600}
            className="rounded-3xl shadow-2xl hover:-translate-y-2 transition"
          />
        </motion.div>
      </section>


      <section id="how" className="py-24 bg-[#646DE8] text-white px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h3 className="text-3xl font-bold mb-4">
              Stay Organized
            </h3>

            <p className="opacity-90 mb-6">
              Organize your study sessions by simply creating courses!
            </p>

            <Link
              href="/start"
              className="bg-black px-6 py-3 rounded-full font-semibold"
            >
              Create course →
            </Link>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src="/courses.png"
              alt="Courses"
              width={800}
              height={500}
              className="rounded-3xl shadow-2xl hover:-translate-y-2 transition"
            />
          </motion.div>
        </div>
      </section>


      <section className="py-24 bg-[#646DE8] text-white px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Image
              src="/flashcards.png"
              alt="Flashcards"
              width={800}
              height={500}
              className="rounded-3xl shadow-2xl hover:-translate-y-2 transition"
            />
          </motion.div>

          <div>
            <h3 className="text-3xl font-bold mb-4">
              Create Flashcards
            </h3>

            <p className="opacity-90 mb-6">
              Instantly create flashcards with your study material,
              with Flash everything is quick and simple!
            </p>

            <Link
              href="/start"
              className="bg-black px-6 py-3 rounded-full font-semibold"
            >
              Create Flashcard →
            </Link>
          </div>
        </div>
      </section>


      <section className="py-24 bg-white text-center px-6">
        <h2 className="text-4xl font-bold text-[#646DE8] mb-4">
          Start Your Journey to Academic Success
        </h2>

        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Join Flash to get a quick and simple experience!
          Create courses, add flashcards, and learn smarter everyday!
        </p>

        <Link
          href="/signup"
          className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold"
        >
          Create an account
        </Link>
      </section>


      <footer className="bg-[#646DE8] text-white py-6 text-center text-sm flex items-center justify-center gap-3">
        <Image src="/logo.png" alt="logo" width={18} height={18} />
        © 2026 Flash. All rights reserved.
      </footer>

    </main>
  );
}
