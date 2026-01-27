import React, { useEffect, useState } from 'react'
import { Music, MessageSquare } from 'lucide-react'

// REPLACE THIS WITH YOUR DISCORD USER ID
const DISCORD_ID = '1234773099476422682' // Placeholder (or put your ID here)

interface LanyardData {
    discord_user: {
        username: string
        avatar: string
        id: string
        discriminator: string
        global_name?: string
    }
    discord_status: 'online' | 'idle' | 'dnd' | 'offline'
    listening_to_spotify: boolean
    spotify: {
        track_id: string
        timestamps: {
            start: number
            end: number
        }
        song: string
        artist: string
        album_art_url: string
        album: string
    } | null
    activities: {
        name: string
        state: string
        details: string
        assets: {
            large_image: string
            large_text: string
        }
    }[]
}

export default function SocialStatus() {
    const [data, setData] = useState<LanyardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Initial fetch
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
                const json = await response.json()
                if (json.success) {
                    setData(json.data)
                }
            } catch (error) {
                console.error('Failed to fetch Lanyard data', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        // Poll every 10 seconds (Lanyard recommends WebSocket for real-time, but polling is simpler for static-site-like usage locally)
        const interval = setInterval(fetchData, 10000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="bg-background/40 rounded-xl border p-4 animate-pulse h-40">
                <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-1/4 bg-muted rounded"></div>
                            <div className="h-2 w-1/2 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Helper for Status Color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500'
            case 'idle': return 'bg-yellow-500'
            case 'dnd': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const avatarUrl = data?.discord_user.avatar
        ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`
        : 'https://cdn.discordapp.com/embed/avatars/0.png'

    return (
        <div className="bg-background/40 rounded-xl border p-4 flex flex-col gap-4">
            {/* Header */}
            <h3 className="text-foreground/90 text-sm font-semibold flex items-center gap-2">
                Live Status
                <span className={`inline-block h-2 w-2 rounded-full ${data ? getStatusColor(data.discord_status) : 'bg-gray-400'}`}></span>
            </h3>

            <div className="flex flex-col gap-4">
                {/* Discord User Info */}
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <img
                            src={avatarUrl}
                            alt="Discord Avatar"
                            className="w-10 h-10 rounded-full border-2 border-background shadow-sm"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-background rounded-full ${data ? getStatusColor(data.discord_status) : 'hidden'}`}></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-foreground font-medium text-sm truncate">
                            {data?.discord_user.global_name || data?.discord_user.username || 'User'}
                        </span>
                        <span className="text-muted-foreground text-xs truncate">
                            {data?.activities.find(a => a.name !== 'Spotify')?.state || data?.discord_status || 'Offline'}
                        </span>
                    </div>
                </div>

                {/* Spotify Status - Only if listening */}
                {data?.listening_to_spotify && data.spotify ? (
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/10">
                        <div className="relative shrink-0 w-10 h-10 rounded overflow-hidden shadow-sm">
                            <img
                                src={data.spotify.album_art_url}
                                alt="Album Art"
                                className="w-full h-full object-cover animate-spin-slow"
                                style={{ animationDuration: '10s' }} // Slow spin for effect
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <a
                                href={`https://open.spotify.com/track/${data.spotify.track_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground font-medium text-xs truncate hover:underline hover:text-green-500 transition-colors"
                            >
                                {data.spotify.song}
                            </a>
                            <span className="text-muted-foreground text-xs truncate">
                                by {data.spotify.artist}
                            </span>
                        </div>
                    </div>
                ) : (
                    null
                )}
            </div>
        </div>
    )
}
