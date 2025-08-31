import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif font-bold text-2xl text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue to KonvoGrad</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              card: "shadow-none border border-border/50",
            }
          }}
        />
      </div>
    </div>
  )
}
