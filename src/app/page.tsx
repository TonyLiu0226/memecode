import AuthButton from '@/components/buttons/AuthButton'
import DashboardSection from '@/components/DashboardSection'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to Memecode
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            An app that motivates you to do your daily leetcode before you start gooning off
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <div className="rounded-md shadow">
              <AuthButton />
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardSection order={1} title="Solve Daily LeetCode" description="Get personalized problems" color="blue" />
          <DashboardSection order={2} title="Unlock Memes" description="Earn your daily memes" color="green" />
          <DashboardSection order={3} title="Stay Motivated" description="Build consistent habits" color="red" />
        </div>
      </div>
    </div>
  )
}
