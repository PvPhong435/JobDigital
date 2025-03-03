'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthDialogProps {
  trigger: React.ReactNode;
}

type AuthStep = 'login' | 'register' | 'forgotPassword' | 'otpVerification' | 'changePassword';

export function AuthDialog({ trigger }: AuthDialogProps) {
  const [open, setOpen] = useState(false)
  const [authStep, setAuthStep] = useState<AuthStep>('login')
  const [email, setEmail] = useState('')

  const handleForgotPassword = () => {
    setAuthStep('forgotPassword')
  }

  const handleSendRecoveryEmail = () => {
    // Here you would typically send the recovery email
    console.log('Sending recovery email to:', email)
    setAuthStep('otpVerification')
  }

  const handleVerifyOTP = () => {
    // Here you would typically verify the OTP
    console.log('Verifying OTP')
    setAuthStep('changePassword')
  }

  const handleChangePassword = () => {
    // Here you would typically change the password
    console.log('Changing password')
    setAuthStep('login')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {authStep === 'login' || authStep === 'register' ? 'Đăng nhập / Đăng ký' : 
             authStep === 'forgotPassword' ? 'Quên mật khẩu' :
             authStep === 'otpVerification' ? 'Xác minh OTP' : 'Đổi mật khẩu'}
          </DialogTitle>
        </DialogHeader>
        {(authStep === 'login' || authStep === 'register') && (
          <Tabs defaultValue={authStep} className="w-full" onValueChange={(value) => setAuthStep(value as AuthStep)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">Đăng nhập</Button>
              <Button variant="link" className="w-full" onClick={handleForgotPassword}>
                Quên mật khẩu?
              </Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mật khẩu</Label>
                <Input id="register-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="w-full">Đăng ký</Button>
            </TabsContent>
          </Tabs>
        )}
        {authStep === 'forgotPassword' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email khôi phục</Label>
              <Input 
                id="recovery-email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleSendRecoveryEmail}>Xác nhận</Button>
          </div>
        )}
        {authStep === 'otpVerification' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Nhập mã OTP 6 chữ số</Label>
              <Input id="otp" type="text" maxLength={6} placeholder="000000" />
            </div>
            <Button className="w-full" onClick={handleVerifyOTP}>Xác minh</Button>
          </div>
        )}
        {authStep === 'changePassword' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Xác nhận mật khẩu mới</Label>
              <Input id="confirm-new-password" type="password" />
            </div>
            <Button className="w-full" onClick={handleChangePassword}>Đổi mật khẩu</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

