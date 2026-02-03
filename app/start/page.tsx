import Image from "next/image";
import Link from "next/link";

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[#646DE8] text-white flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="px-10 py-8">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Image src="/logo.png" alt="logo" width={22} height={22} />
          Flash
        </div>
      </header>


      {/* ================= CENTER CONTENT ================= */}
      <section className="flex-1 flex items-start justify-center pt-15 md:pt-36 px-12">

        {/* Better proportions */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-20 items-center">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-7xl font-extrabold leading-tight">
              Simple to Use <br />
              Remember <br />
              Faster!
            </h1>

            <p className="mt-6 text-lg opacity-90">
              The best way to study!
            </p>
          </div>


          {/* RIGHT CARD */}
          <div className="flex justify-center">
            <div className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">

              <h2 className="text-2xl font-bold mb-10">
                Let’s start learning!
              </h2>

              <div className="flex flex-col gap-6">

                <Link
                  href="/signup"
                  className="bg-white text-black py-4 rounded-xl font-semibold text-lg"
                >
                  Sign up with email
                </Link>

                <span className="opacity-70">or</span>

                <Link
                  href="/login"
                  className="bg-white text-black py-4 rounded-xl font-semibold text-lg"
                >
                  Log In with email
                </Link>

              </div>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
