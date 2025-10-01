'use client'
import { UserResult } from '@/types/types'

export default function MemeTracker(props: {
    userdata: UserResult
}) {
    return (
        <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900">Memes Viewed</h3>
        <p className="text-purple-700 mt-2"> How many times have you gooned in total?</p>
        <div className="mt-4">
          <div className="text-2xl font-bold text-purple-600">{props.userdata.total_memes}</div>
          <div className="text-sm text-purple-500">Total memes</div>
        </div>
      </div>
    )
}