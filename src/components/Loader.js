'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'

export default function Loader({ text = 'Chargement...' }) {
  return (
    <div className="flex items-center gap-2 text-yellow-400 text-sm animate-pulse">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </div>
  )
}