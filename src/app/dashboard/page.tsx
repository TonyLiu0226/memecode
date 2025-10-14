
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import QuestionTracker from '@/components/trackers/QuestionTracker'
import ProgressTracker from '@/components/trackers/ProgressTracker'
import MemeTracker from '@/components/trackers/MemeTracker'
import { generateQuestion } from '@/app/actions'
import QuestionInfo from '@/components/QuestionInfo'
import MemeViewer from '@/components/MemeViewer'
import { getUserDataById, getLcUsernameById } from '@/app/supabase'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  const userdata = await getUserDataById(supabase, user.id)
  const username = await getLcUsernameById(supabase, user.id)
  
  if (!userdata || !username) redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Dashboard
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <QuestionTracker username={user.id} data={userdata} lc_session={username.lc_session} csrftoken={username.csrftoken} difficulties={(username?.difficulties as string[] | undefined) || []} generateQuestion={generateQuestion} />
            <ProgressTracker userdata={userdata} />
            <MemeTracker userdata={userdata} />
          </div>
          <div className="align-center justify-center mt-10 w-full">
            <QuestionInfo username={username.lc_username} mediaType={username.meme_preferences as string[]} />
          </div>
          <div className="align-center justify-center mt-10 w-full">

            <MemeViewer mediaType={username.meme_preferences as string[]} />
          </div>
        </div>
      </div>
    </div>
  )
}
