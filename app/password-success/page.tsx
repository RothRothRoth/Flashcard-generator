import Image from "next/image";
import Link from "next/link";

export default function PasswordSuccessPage() {
  return (
    <main className="min-h-screen bg-[#646DE8] text-white flex flex-col">

      <header className="px-10 py-8">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Image src="/logo.png" alt="logo" width={22} height={22} />
          Flash
        </div>
      </header>

      <section className="flex-1 flex items-start justify-center pt-36 px-12">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-20 items-center">

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

          <div className="flex justify-center">
            <div className="w-[460px] bg-[#646DE8] border border-white/30 rounded-3xl p-12 shadow-[0_12px_40px_rgba(0,0,0,0.25)] text-center">

              <Image
                src="/shield-check.png"
                alt="success"
                width={110}
                height={110}
                className="mx-auto mb-8"
              />

              <h2 className="text-2xl font-bold mb-3">
                Password Changed!
              </h2>

              <p className="opacity-90 mb-8">
                Your password has been updated successfully
              </p>

              <Link
                href="/login"
                className="bg-white text-black py-4 rounded-xl font-semibold block"
              >
                Continue to Log In
              </Link>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
