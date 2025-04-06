interface SystemPerformanceProps {
    systemPerformance: any; // Replace 'any' with the appropriate type if known
  }
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'  

const SystemPerformance: React.FC<SystemPerformanceProps> = ({ systemPerformance }) => {
  return (
    <div>
      <div className="col-span-1 bg-white dark:bg-gray-800 rounded shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                System Performance
              </h2>
              <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {/* Server Uptime */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Server Uptime
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.serverUptime}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (parseFloat(systemPerformance.serverUptime) / 10) * 100,
                        100,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Database Load */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Database Load
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.databaseLoad}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${parseFloat(systemPerformance.databaseLoad)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* API Response Time */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    API Response Time
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.apiResponseTime}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        parseInt(systemPerformance.apiResponseTime) / 10,
                        100,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Disk Usage
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.diskUsage}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${parseFloat(systemPerformance.diskUsage)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* CPU Usage */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    CPU Usage
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.cpuUsage}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${parseFloat(systemPerformance.cpuUsage)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Memory Usage
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.memoryUsage}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{
                      width: `${parseFloat(systemPerformance.memoryUsage)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Thread Count */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Thread Count
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.threadCount}
                  </span>
                </div>
              </div>

              {/* Network Latency */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Network Latency
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {systemPerformance.networkLatency}
                  </span>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}
export default SystemPerformance;
