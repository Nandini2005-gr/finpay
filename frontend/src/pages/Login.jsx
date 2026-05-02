import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate("/dashboard")
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 flex-col justify-center items-center p-12">
        <div className="text-center">
          <div className="text-6xl mb-6">💳</div>
          <h1 className="text-4xl font-bold text-white mb-4">FinPay</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Your smart personal finance dashboard.<br />
            Track expenses, manage wallet, get AI insights.
          </p>
          <div className="mt-12 flex flex-col gap-4">
            {["Track spending in real-time", "AI-powered insights", "Beautiful charts & analytics"].map(f => (
              <div key={f} className="flex items-center gap-3 text-blue-100">
                <span className="text-green-400 text-xl">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <span className="text-4xl">💳</span>
            <h1 className="text-2xl font-bold text-white mt-2">FinPay</h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-blue-500 transition"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-blue-500 transition"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}