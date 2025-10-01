'use client'

import { createClient as createBrowserClient } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter, redirect} from 'next/navigation'
import { LeetcodeUsernameResult, Difficulties, UserResult } from '@/types/types'

export default function Settings() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createBrowserClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        console.log(user.id)
        try {
            // Load user preferences from localStorage and supabase
            const savedDifficulties = localStorage.getItem('difficulties') || '[]'
            const result = await supabase.from('lc_usernames').select('*').eq('id', user.id)
            const lc_username = result.data?.[0] as LeetcodeUsernameResult
            setLeetcodeUsername(lc_username.lc_username || '')
            setDifficulties(JSON.parse(savedDifficulties))
        } catch (error) {
            console.error('Error loading user preferences:', error);
            setLeetcodeUsername('');
            setDifficulties([]);
        }
        
      } else {
        redirect('/')
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleDifficultyChange = (difficulty: string) => {
    setDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    setMessage('')
    
    try {
      await supabase.from('lc_usernames').upsert({
        id: user.id,
        lc_username: leetcodeUsername
      })
      localStorage.setItem('difficulties', JSON.stringify(difficulties))
      
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          
          <div className="p-6">
            <div className="space-y-8">
              {/* Profile Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Settings
                </h2>
                
                <div className="space-y-6">
                  {/* LeetCode Username */}
                  <div>
                    <label htmlFor="leetcode-username" className="block text-lgfont-medium text-gray-700 mb-2">
                      LeetCode Username
                    </label>
                    <input
                      id="leetcode-username"
                      type="text"
                      value={leetcodeUsername}
                      onChange={(e) => setLeetcodeUsername(e.target.value)}
                      placeholder="Enter your LeetCode username"
                      className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Question Difficulty */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Question Difficulty Preferences
                    </label>
                    <h3 className="text-sm text-gray-500 mb-3">
                      Select the difficulty levels you want to practice
                    </h3>
                    <div className="space-y-2">
                      {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                        <label key={difficulty} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={difficulties.includes(difficulty.toLowerCase())}
                            onChange={() => handleDifficultyChange(difficulty.toLowerCase())}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-md ${
                  message.includes('Error') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
