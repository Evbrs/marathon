import { redirect } from 'next/navigation'

// Root page — redirects to the protected dashboard
export default function RootPage() {
  redirect('/dashboard')
}
