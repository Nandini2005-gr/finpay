import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API from "../api"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Other"]

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: "", amount: "", category: "Food", type: "debit"
  })

  const fetchData = async () => {
    const [summaryRes, txRes] = await Promise.all([
      API.get("/transactions/summary"),
      API.get("/transactions/")
    ])
    setSummary(summaryRes.data)
    setTransactions(txRes.data)
  }

  useEffect(() => { fetchData() }, [])

  const handleAddTransaction = async () => {
    if (!form.title || !form.amount) return
    await API.post("/transactions/", {
      ...form,
      amount: parseFloat(form.amount)
    })
    setForm({ title: "", amount: "", category: "Food", type: "debit" })
    setShowForm(false)
    fetchData()
  }

  const handleLogout = () => { logout(); navigate("/") }

  // Chart data
  const pieData = summary
    ? Object.entries(summary.spending_by_category).map(([name, value]) => ({ name, value }))
    : []

  const areaData = transactions.slice().reverse().map((t, i) => ({
    name: `#${i + 1}`,
    amount: t.type === "credit" ? t.amount : -t.amount
  }))

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">💳 FinPay</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-600 rounded-2xl p-6">
            <p className="text-blue-200 text-sm mb-1">Total Balance</p>
            <p className="text-3xl font-bold">₹{summary?.balance?.toFixed(2) ?? "..."}</p>
          </div>
          <div className="bg-green-600 rounded-2xl p-6">
            <p className="text-green-200 text-sm mb-1">Total Income</p>
            <p className="text-3xl font-bold">₹{summary?.total_income?.toFixed(2) ?? "..."}</p>
          </div>
          <div className="bg-red-600 rounded-2xl p-6">
            <p className="text-red-200 text-sm mb-1">Total Expenses</p>
            <p className="text-3xl font-bold">₹{summary?.total_expenses?.toFixed(2) ?? "..."}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Area Chart */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#1d4ed8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm mt-8 text-center">No expenses yet</p>
            )}
          </div>
        </div>

        {/* Add Transaction */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
            >
              + Add Transaction
            </button>
          </div>

          {showForm && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-800 rounded-xl">
              <input
                placeholder="Title (e.g. Lunch)"
                className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <input
                placeholder="Amount"
                type="number"
                className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
              <select
                className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select
                className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="debit">Debit (Expense)</option>
                <option value="credit">Credit (Income)</option>
              </select>
              <button
                onClick={handleAddTransaction}
                className="md:col-span-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm transition"
              >
                Save Transaction
              </button>
            </div>
          )}

          {/* Transaction List */}
          <div className="flex flex-col gap-3">
            {transactions.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No transactions yet. Add one!</p>
            )}
            {transactions.map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.category} • {new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <p className={`font-bold text-lg ${t.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "credit" ? "+" : "-"}₹{t.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}