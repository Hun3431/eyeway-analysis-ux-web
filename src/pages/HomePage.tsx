import { Home, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Home className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            환영합니다!
          </h1>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          React + TypeScript + Vite 프로젝트입니다
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/about">
            <Button className="gap-2">
              <Info className="h-4 w-4" />
              정보 보기
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            포함된 기술 스택:
          </h2>
          <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Vite
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> React 19
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> TypeScript
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Tailwind CSS v4
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> React Router
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Lucide Icons
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> shadcn/ui
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
