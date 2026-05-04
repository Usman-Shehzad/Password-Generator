import { useMemo, useState } from 'react'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
const SAFE_SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?'

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const strengthFromEntropy = (entropy: number) => {
  if (entropy < 40) return { label: 'Weak', tone: 'weak' }
  if (entropy < 60) return { label: 'Fair', tone: 'fair' }
  if (entropy < 80) return { label: 'Strong', tone: 'strong' }
  return { label: 'Elite', tone: 'elite' }
}

const generatePassword = (length: number, alphabet: string) => {
  const values = new Uint32Array(length)
  window.crypto.getRandomValues(values)
  let output = ''
  for (let i = 0; i < length; i += 1) {
    output += alphabet[values[i] % alphabet.length]
  }
  return output
}

function App() {
  const [length, setLength] = useState(24)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeDigits, setIncludeDigits] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [useFullSymbols, setUseFullSymbols] = useState(true)
  const [excludeLookalikes, setExcludeLookalikes] = useState(false)
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const alphabet = useMemo(() => {
    let pool = ''
    if (includeUpper) pool += UPPER
    if (includeLower) pool += LOWER
    if (includeDigits) pool += DIGITS
    if (includeSymbols) pool += useFullSymbols ? SYMBOLS : SAFE_SYMBOLS

    if (excludeLookalikes) {
      pool = pool.replace(/[O0Il1|]/g, '')
    }

    return pool
  }, [
    includeUpper,
    includeLower,
    includeDigits,
    includeSymbols,
    useFullSymbols,
    excludeLookalikes,
  ])

  const entropy = useMemo(() => {
    if (!alphabet.length) return 0
    return length * Math.log2(alphabet.length)
  }, [alphabet.length, length])

  const strength = strengthFromEntropy(entropy)

  const handleGenerate = () => {
    if (!alphabet.length) return
    setPassword(generatePassword(length, alphabet))
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const handleReset = () => {
    setLength(24)
    setIncludeUpper(true)
    setIncludeLower(true)
    setIncludeDigits(true)
    setIncludeSymbols(true)
    setUseFullSymbols(true)
    setExcludeLookalikes(false)
    setPassword('')
    setIsVisible(false)
    setCopied(false)
  }

  const toneBadge = {
    weak: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
    fair: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
    strong: 'border-teal-300/30 bg-teal-400/10 text-teal-100',
    elite: 'border-blue-400/30 bg-blue-500/10 text-blue-100',
  }[strength.tone]

  const toneBar = {
    weak: 'bg-rose-500',
    fair: 'bg-amber-400',
    strong: 'bg-teal-400',
    elite: 'bg-blue-500',
  }[strength.tone]

  return (
    <div className="min-h-screen bg-[#030814] text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 font-['Space_Grotesk',sans-serif] sm:px-6 sm:py-12 lg:px-8">
        <header className="relative overflow-hidden rounded-[32px] border border-cyan-200/10 bg-gradient-to-br from-[#0b1e3b] via-[#07172f] to-[#050f22] px-6 py-8 text-cyan-50 sm:rounded-[36px] sm:px-8 sm:py-11 md:pr-72">
          <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-cyan-400/20 blur-[110px]" />
          <div className="absolute -left-24 -bottom-20 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,182,212,0.2),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_60%)]" />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex lg:right-12">
            <div className="rounded-[28px] border border-cyan-200/15 bg-cyan-200/5 p-6 shadow-[0_25px_60px_-40px_rgba(34,211,238,0.8)]">
              <svg
                viewBox="0 0 140 160"
                role="presentation"
                aria-hidden="true"
                className="h-36 w-32"
                fill="none"
              >
                <defs>
                  <linearGradient id="lockGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <path
                  d="M32 70V50C32 28.91 49.91 12 71 12C92.09 12 110 28.91 110 50V70"
                  stroke="url(#lockGlow)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <rect
                  x="22"
                  y="70"
                  width="98"
                  height="72"
                  rx="18"
                  fill="rgba(8,27,48,0.85)"
                  stroke="url(#lockGlow)"
                  strokeWidth="6"
                />
                <circle cx="71" cy="105" r="12" fill="url(#lockGlow)" />
                <rect x="66" y="115" width="10" height="18" rx="5" fill="#67e8f9" />
              </svg>
            </div>
          </div>
          <div className="relative z-10 flex flex-col gap-5">
            <span className="w-fit rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-cyan-100">
              Quantum-grade generator
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Ultimate Password Forge
            </h1>
            <p className="max-w-2xl text-sm text-cyan-100/70 sm:text-base md:text-lg">
              Generate strong passwords instantly with a cryptographic RNG,
              customize length and character sets, and see real-time entropy to
              gauge strength before you copy.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-cyan-100/80 sm:text-xs">
              {['Secure RNG', 'All ASCII', 'Entropy score'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex justify-center md:hidden">
              <div className="rounded-3xl border border-cyan-200/15 bg-cyan-200/5 p-4 shadow-[0_20px_50px_-35px_rgba(34,211,238,0.75)]">
                <svg
                  viewBox="0 0 140 160"
                  role="presentation"
                  aria-hidden="true"
                  className="h-24 w-24"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="lockGlowMobile" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M32 70V50C32 28.91 49.91 12 71 12C92.09 12 110 28.91 110 50V70"
                    stroke="url(#lockGlowMobile)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <rect
                    x="22"
                    y="70"
                    width="98"
                    height="72"
                    rx="18"
                    fill="rgba(8,27,48,0.85)"
                    stroke="url(#lockGlowMobile)"
                    strokeWidth="6"
                  />
                  <circle cx="71" cy="105" r="12" fill="url(#lockGlowMobile)" />
                  <rect x="66" y="115" width="10" height="18" rx="5" fill="#67e8f9" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <section className="relative flex flex-col gap-6 rounded-[26px] border border-cyan-200/10 bg-gradient-to-br from-[#081a35] via-[#061329] to-[#050f22] p-5 sm:rounded-[30px] sm:p-7">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/5" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Generator
                </h2>
                <p className="text-sm text-cyan-100/60">
                  Choose length, rules, and character sets.
                </p>
              </div>
              <button
                className="rounded-full border border-cyan-200/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100 transition hover:border-cyan-200/50"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="length" className="text-sm text-cyan-100/80">
                Password length
              </label>
              <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                <input
                  id="length"
                  type="range"
                  min={6}
                  max={64}
                  value={length}
                  onChange={(event) =>
                    setLength(clamp(Number(event.target.value), 6, 64))
                  }
                  className="w-full accent-cyan-400"
                />
                <input
                  className="rounded-2xl border border-cyan-200/10 bg-[#040b1a] px-4 py-2 text-center text-base font-semibold text-cyan-50 shadow-[inset_0_0_24px_rgba(14,116,144,0.35)] sm:text-lg"
                  type="number"
                  min={6}
                  max={64}
                  value={length}
                  onChange={(event) =>
                    setLength(clamp(Number(event.target.value), 6, 64))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[16, 24, 32, 48].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      value === length
                        ? 'border-transparent bg-gradient-to-r from-cyan-300 to-blue-400 text-slate-950 shadow-[0_10px_25px_-18px_rgba(34,211,238,0.8)]'
                        : 'border-cyan-200/20 text-cyan-100/80 hover:border-cyan-200/40'
                    }`}
                    onClick={() => setLength(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-200/5 px-4 py-3 text-sm text-cyan-100/90 shadow-[0_12px_28px_-20px_rgba(8,145,178,0.7)]">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(event) => setIncludeUpper(event.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Uppercase A-Z
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-200/5 px-4 py-3 text-sm text-cyan-100/90 shadow-[0_12px_28px_-20px_rgba(8,145,178,0.7)]">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(event) => setIncludeLower(event.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Lowercase a-z
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-200/5 px-4 py-3 text-sm text-cyan-100/90 shadow-[0_12px_28px_-20px_rgba(8,145,178,0.7)]">
                <input
                  type="checkbox"
                  checked={includeDigits}
                  onChange={(event) => setIncludeDigits(event.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Digits 0-9
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-200/5 px-4 py-3 text-sm text-cyan-100/90 shadow-[0_12px_28px_-20px_rgba(8,145,178,0.7)]">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(event) => setIncludeSymbols(event.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Symbols
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-200/5 px-4 py-3 text-sm text-cyan-100/90 shadow-[0_12px_28px_-20px_rgba(8,145,178,0.7)]">
                <input
                  type="checkbox"
                  checked={useFullSymbols}
                  onChange={(event) => setUseFullSymbols(event.target.checked)}
                  disabled={!includeSymbols}
                  className="h-4 w-4 accent-cyan-400"
                />
                Full ASCII symbols
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-cyan-200/10 bg-cyan-200/5 px-4 py-3 text-sm text-cyan-100/90 shadow-[0_12px_28px_-20px_rgba(8,145,178,0.7)]">
                <input
                  type="checkbox"
                  checked={excludeLookalikes}
                  onChange={(event) => setExcludeLookalikes(event.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Exclude look-alikes
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_20px_45px_-18px_rgba(34,211,238,0.9)] transition hover:-translate-y-0.5 sm:w-auto"
                onClick={handleGenerate}
                disabled={!alphabet.length}
              >
                Generate password
              </button>
              <button
                type="button"
                className="w-full rounded-2xl border border-cyan-200/20 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 sm:w-auto"
                onClick={handleGenerate}
              >
                Shuffle
              </button>
            </div>
          </section>

          <section className="relative flex flex-col gap-6 rounded-[26px] border border-cyan-200/10 bg-gradient-to-br from-[#061629] via-[#061328] to-[#050f22] p-5 sm:rounded-[30px] sm:p-7">
            <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/5" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Output
                </h2>
                <p className="text-sm text-cyan-100/60">
                  Copy or reveal your secure password.
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.28em] ${toneBadge}`}
              >
                {strength.label}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="password" className="text-sm text-cyan-100/80">
                Generated password
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="password"
                  className="w-full rounded-2xl border border-cyan-200/10 bg-[#040b1a] px-4 py-3 text-base text-cyan-50 shadow-[inset_0_0_18px_rgba(14,116,144,0.35)] placeholder:text-cyan-200/30 font-['JetBrains_Mono',monospace] sm:text-lg"
                  type={isVisible ? 'text' : 'password'}
                  value={password}
                  placeholder="Click generate"
                  readOnly
                />
                <button
                  type="button"
                  className="w-full rounded-2xl border border-cyan-200/20 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 sm:w-auto"
                  onClick={() => setIsVisible((prev) => !prev)}
                >
                  {isVisible ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-200/10 bg-[#040b1a] p-4 shadow-[inset_0_0_26px_rgba(8,145,178,0.25)]">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-cyan-100/50">
                <span>Entropy</span>
                <span>{entropy.toFixed(2)} bits</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cyan-200/10">
                <div
                  className={`h-full ${toneBar}`}
                  style={{ width: `${clamp(entropy, 0, 128)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-cyan-100/50">
                $H = L * log_2(R)$ with R = pool size
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="w-full rounded-2xl border border-cyan-200/20 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 sm:w-auto"
                onClick={handleGenerate}
              >
                Regenerate
              </button>
              <button
                type="button"
                className="w-full rounded-2xl border border-cyan-200/20 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/40 sm:w-auto"
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="rounded-2xl border border-cyan-200/10 bg-cyan-200/5 p-4">
              <h3 className="text-sm font-semibold text-cyan-100">
                Character pool
              </h3>
              <p className="mt-2 text-xs text-cyan-100/60">
                {alphabet.length
                  ? `${alphabet.length} characters available.`
                  : 'Select at least one set to generate.'}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
