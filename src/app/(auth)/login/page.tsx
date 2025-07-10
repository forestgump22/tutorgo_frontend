"use client"

import { useState, type FormEvent, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setCookie } from "cookies-next"
import { useAuthStore } from "@/stores/auth.store"
import { loginUser } from "@/services/auth.service"
import type { LoginRequest, AuthResponse } from "@/models/auth.models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  const handleAuthSuccess = useCallback(
    (response: AuthResponse) => {
      setCookie("token", response.accessToken, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 día
      })
      setAuth(response.accessToken, response.user)
      router.push("/dashboard")
      router.refresh()
    },
    [setAuth, router],
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const credentials: LoginRequest = { email, password }
    try {
      const response = await loginUser(credentials)
      handleAuthSuccess(response)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simular login con Google
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockResponse: AuthResponse = {
        accessToken: "mock-google-token",
        user: {
          id: "google-user-1",
          nombre: "Usuario Google",
          email: "usuario@gmail.com",
          rol: "ESTUDIANTE",
          fotoUrl: "/placeholder.svg?height=48&width=48",
        },
        message: "Login exitoso con Google",
      }
      handleAuthSuccess(mockResponse)
    } catch (err: any) {
      setError("El inicio de sesión con Google falló. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-3xl font-bold text-blue-600">TUTOR</div>
            <div className="text-3xl font-bold text-gray-800 ml-1">GO</div>
          </div>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Messages */}
            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <div className="w-4 h-4 mr-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
              )}
              Continuar con Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continúa con</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Regístrate
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
