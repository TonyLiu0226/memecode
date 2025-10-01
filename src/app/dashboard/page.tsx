import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import QuestionTracker from '@/components/trackers/QuestionTracker'
import ProgressTracker from '@/components/trackers/ProgressTracker'
import MemeTracker from '@/components/trackers/MemeTracker'
import { UserResult } from '@/types/types'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  const { data: userdata, error: userdataError } = await supabase.from('users').select('*').eq('id', user.id).single()
  const { data: username, error: usernameError } = await supabase.from('lc_usernames').select('*').eq('id', user.id).single()
  
  if (userdataError || usernameError) {
    console.error(userdataError || usernameError)
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Dashboard
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <QuestionTracker username={user.id} data={userdata} />
            <ProgressTracker userdata={userdata} />
            <MemeTracker userdata={userdata} />
          </div>
        </div>
      </div>
    </div>
  )
}
