"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Main content card */}
      <div className="max-w-md w-full text-center">
        <h1 className="text-7xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-200 mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>

        <Link href="/">
          <Button className="bg-white text-gray-950 hover:bg-gray-200 font-semibold px-8 py-2">Go Back Home</Button>
        </Link>
      </div>
    </main>
  )
}
