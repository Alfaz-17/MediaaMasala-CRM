"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await apiClient.post("/auth/register", { email, password })
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-[40px] shadow-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <CardTitle className="text-2xl font-black">Registration Successful!</CardTitle>
          <p className="text-gray-500">Your account has been created. You will be redirected to the login page shortly.</p>
          <p className="text-sm font-bold text-primary">Please contact an admin to assign your job role.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-[40px] shadow-2xl overflow-hidden border-none">
        <div className="bg-primary h-2 w-full" />
        <CardHeader className="pt-10 pb-6 px-10">
          <CardTitle className="text-3xl font-black tracking-tighter">Join Media Masala</CardTitle>
          <CardDescription className="text-base font-medium">Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-gray-400 ml-1">Official Email</Label>
              <Input 
                type="email" 
                placeholder="name@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-12 rounded-2xl border-gray-100 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-gray-400 ml-1">Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-12 rounded-2xl border-gray-100 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-gray-400 ml-1">Confirm Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="h-12 rounded-2xl border-gray-100 focus:ring-primary/20"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-primary text-white font-black rounded-2xl text-lg shadow-lg shadow-primary/20"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50/50 py-6 px-10 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium w-full">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-black underline-offset-4">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
