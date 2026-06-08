interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonClass?: string
  icon?: 'warning' | 'danger' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
  icon = 'warning',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
  }

  const iconColors = {
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl ${iconColors[icon]} shadow-sm`}>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
            {title}
          </h3>

          <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: message }} />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-all text-sm"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 text-white font-bold rounded-xl transition-all text-sm shadow-md ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
