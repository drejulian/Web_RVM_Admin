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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
