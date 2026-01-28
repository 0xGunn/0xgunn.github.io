import { useEffect, useState } from 'react'

interface ImageZoomProps {
    className?: string
}

export default function ImageZoom({ className = '' }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [imageSrc, setImageSrc] = useState<string>('')
    const [imageAlt, setImageAlt] = useState<string>('')

    useEffect(() => {
        let cleanupFunctions: Array<() => void> = []

        const initializeImageZoom = () => {
            // Wait a bit for Astro to finish rendering
            setTimeout(() => {
                // Find all images within article content
                const images = document.querySelectorAll<HTMLImageElement>(
                    'article.prose img'
                )

                const handleImageClick = (event: MouseEvent) => {
                    const target = event.currentTarget as HTMLImageElement
                    // Get the actual displayed src (handles both relative and absolute paths)
                    setImageSrc(target.src)
                    setImageAlt(target.alt || '')
                    setIsOpen(true)
                }

                // Attach click handlers to all images
                images.forEach((img) => {
                    img.style.cursor = 'pointer'
                    img.addEventListener('click', handleImageClick)
                })

                // Store cleanup function for these specific images
                const cleanup = () => {
                    images.forEach((img) => {
                        img.removeEventListener('click', handleImageClick)
                    })
                }

                cleanupFunctions.push(cleanup)
            }, 100)
        }

        // Initialize on mount
        initializeImageZoom()

        // Re-initialize on Astro page navigation
        const handleAstroPageLoad = () => {
            initializeImageZoom()
        }

        document.addEventListener('astro:page-load', handleAstroPageLoad)

        // Cleanup function
        return () => {
            // Run all cleanup functions
            cleanupFunctions.forEach((cleanup) => cleanup())
            document.removeEventListener('astro:page-load', handleAstroPageLoad)
        }
    }, [])

    useEffect(() => {
        if (!isOpen) return

        // Handle keyboard navigation
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the backdrop, not the image
        if (event.target === event.currentTarget) {
            setIsOpen(false)
        }
    }

    if (!isOpen) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 ${className}`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Image zoom modal"
        >
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-[10000] rounded-full bg-background/90 p-2 text-foreground hover:bg-background transition-colors"
                aria-label="Close image zoom"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <div className="relative max-h-[90vh] max-w-[90vw] animate-in zoom-in-95 duration-200">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    )
}
