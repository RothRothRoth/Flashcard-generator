import Image from "next/image";
import Link from "next/link";

export default function VerificationPage() {
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

              <h2 className="text-3xl font-bold mb-2">
                Verification
              </h2>

              <p className="opacity-90 mb-8 text-sm">
                Enter the code we sent to your email
              </p>

              <div className="flex justify-center gap-3 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      className="w-12 h-12 bg-white text-black rounded-xl text-center text-lg font-bold outline-none shadow-md"
                     />
                ))}
              </div>

              <p className="text-xs opacity-70 mb-6">00:44</p>

<Link
  href="/reset-password"
  className="w-full bg-white text-black py-4 rounded-xl font-semibold block text-center"
>
  Continue
</Link>


              <p className="text-sm mt-5 opacity-90">
                Didn’t receive a code?{" "}
                <Link href="#" className="underline">
                  Resend
                </Link>
              </p>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
