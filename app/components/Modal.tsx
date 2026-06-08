import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showCloseButton?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
