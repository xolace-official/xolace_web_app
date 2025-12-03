import { SignInFormExample } from "@/components/shared/auth/examples/signin-form-example"
import { SignUpFormExample } from "@/components/shared/auth/examples/signup-form-example"

export default function FormInputDemoPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">FormInput Component Demo</h1>
        <p className="text-muted-foreground mt-2">
          Scalable, reusable form inputs for authentication UIs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-semibold">Sign In Example</h2>
          <SignInFormExample />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-semibold">Sign Up Example</h2>
          <SignUpFormExample />
        </div>
      </div>
    </div>
  )
}
