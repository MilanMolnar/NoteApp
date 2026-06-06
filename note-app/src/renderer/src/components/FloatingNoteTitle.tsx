import { selectedNoteAtom } from '@renderer/store';
import { useAtomValue } from 'jotai';
import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({className,...props}: ComponentProps<'div'>) => {
    const title = useAtomValue(selectedNoteAtom)?.title || 'Home';
  return (
    <div className={twMerge('flex justify-center', className)} {...props}>
        <span className="text-gray-400">{title}</span>
    </div>
  )
}
