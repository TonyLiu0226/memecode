export default function DashboardSection({order, title, description, color}: {order: number, title: string, description: string, color: string}) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 bg-${color}-500 rounded-md flex items-center justify-center`}>
                    <span className="text-white font-bold">{order}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {description}
                    </dd>
                  </dl>
                </div>
              </div>
          </div>
    )
}