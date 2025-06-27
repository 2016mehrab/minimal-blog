import { LoginForm } from '@/components/login-form'
import React from 'react'

const Login = () => {
  return (
    <div className="flex min-h-svh w-full bg-background text-foreground items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login