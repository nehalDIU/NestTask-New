'use client'

import React from 'react'

interface ChartData {
  name: string
  value: number
  color: string
}

interface AnalyticsChartProps {
  data: ChartData[]
  type?: 'pie' | 'bar'
}

export function AnalyticsChart({ data, type = 'pie' }: AnalyticsChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (type === 'pie') {
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Simple pie chart using CSS */}
          <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0
              const rotation = data.slice(0, index).reduce((sum, prev) => {
                return sum + (total > 0 ? (prev.value / total) * 360 : 0)
              }, 0)
              
              if (percentage === 0) return null
              
              return (
                <div
                  key={item.name}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${rotation}deg, ${item.color} 0deg, ${item.color} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                  }}
                />
              )
            })}
          </div>
          
          {/* Center circle */}
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-8 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Bar chart
  const maxValue = Math.max(...data.map(item => item.value))

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
        
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
