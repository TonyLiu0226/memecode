'use client'
import { UserResult } from '@/types/types'

export default function ProgressTracker(props: {
    userdata: UserResult
}) {
    return (
            <div className={`bg-green-50 p-4 rounded-lg`}>
              <h3 className="text-lg font-medium text-green-900">Progress</h3>
              <p className="text-green-700 mt-2">Track your solved questions</p>
              <div className="mt-4">
                <div className="text-xl font-bold text-green-600">{props.userdata.total_ez_solved + props.userdata.total_md_solved + props.userdata.total_hd_solved } Questions solved</div>
                <div className="text-sm text-green-500">{props.userdata.total_ez_solved} Easy, {props.userdata.total_md_solved} Medium, {props.userdata.total_hd_solved} Hard</div>
              </div>
            </div>
    )
}