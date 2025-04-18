
import { useEffect, useRef, useState } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  Minimize,
  MonitorSmartphone,
  Subtitles
} from 'lucide-react';
import { StreamingData } from '@/types/anime';
import { VideoProxyService } from '@/services/video-proxy.service';

interface VideoPlayerProps {
  streamingData: StreamingData | null;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const VideoPlayer = ({ 
  streamingData,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Get the video source URL from streaming data
  const rawVideoSource = streamingData?.sources?.[0]?.url || '';
  
  // Apply proxy to video source
  const videoSource = rawVideoSource ? 
    VideoProxyService.getProxiedStreamingUrl(
      rawVideoSource, 
      streamingData?.headers?.Referer
    ) : '';

  useEffect(() => {
    // Reset player state when source changes
    if (playerRef.current) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setRetryCount(0);
      
      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    }
  }, [videoSource]);

  useEffect(() => {
    // Auto-hide controls after inactivity
    const showControls = () => {
      setControlsVisible(true);
      
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      
      controlsTimeout.current = setTimeout(() => {
        if (isPlaying) {
          setControlsVisible(false);
        }
      }, 3000);
    };

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', showControls);
      container.addEventListener('click', () => {
        setControlsVisible(!controlsVisible);
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', showControls);
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying, controlsVisible]);

  // Helper function to set up HLS
  const setupHls = (video: HTMLVideoElement, url: string) => {
    if (!url) return;

    try {
      console.log("Setting up HLS with URL:", url);
      
      // Clean up existing instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      // Create new HLS instance
      const hls = new Hls({
        xhrSetup: (xhr) => {
          // Add any required headers from streamingData
          if (streamingData?.headers) {
            Object.entries(streamingData.headers).forEach(([key, value]) => {
              if (typeof value === 'string') {
                xhr.setRequestHeader(key, value);
              }
            });
          }
        }
      });
      
      // Set up HLS
      hls.loadSource(url);
      hls.attachMedia(video);
      
      // Store the HLS instance
      hlsRef.current = hls;
      
      // Handle HLS events
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed, auto-play");
        video.play().catch(err => console.error("Auto-play failed:", err));
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, attempting to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, attempting to recover");
              hls.recoverMediaError();
              break;
            default:
              // If we've had too many retries, give up
              if (retryCount >= 3) {
                console.error("Fatal error, stopping playback");
                hls.destroy();
              } else {
                console.log(`Attempting recovery, retry ${retryCount + 1}`);
                setRetryCount(prev => prev + 1);
                setTimeout(() => {
                  hls.destroy();
                  setupHls(video, url);
                }, 1000);
              }
              break;
          }
        }
      });
    } catch (error) {
      console.error("Error setting up HLS:", error);
    }
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play().catch(err => console.error("Play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    player.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const player = playerRef.current;
    if (!player) return;

    setVolume(value);
    player.volume = value;
    setIsMuted(value === 0);
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player) return;
    
    setCurrentTime(player.currentTime);
    
    // Check if we're at the end of the video
    if (player.currentTime >= player.duration - 0.5) {
      if (hasNext && onNext) {
        onNext();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = playerRef.current;
    if (!player) return;
    
    const newTime = parseFloat(e.target.value);
    player.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Effect to handle HLS setup
  useEffect(() => {
    const video = playerRef.current;
    if (!video || !videoSource) return;
    
    if (Hls.isSupported()) {
      console.log("HLS is supported, setting up HLS");
      setupHls(video, videoSource);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log("Native HLS support detected");
      video.src = videoSource;
    } else {
      console.error("HLS is not supported in this browser");
    }
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoSource]);

  // Add subtitles to video
  useEffect(() => {
    const video = playerRef.current;
    if (!video || !streamingData?.subtitles) return;
    
    // Remove existing subtitles
    while (video.textTracks.length > 0) {
      video.removeChild(video.textTracks[0]);
    }
    
    // Add new subtitles
    streamingData.subtitles.forEach((subtitle) => {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = subtitle.lang;
      track.srclang = subtitle.lang.substring(0, 2).toLowerCase();
      track.src = VideoProxyService.getProxiedSubtitleUrl(subtitle.url);
      
      // Set the first subtitle as default
      if (streamingData.subtitles[0] === subtitle) {
        track.default = true;
        setActiveSubtitle(subtitle.lang);
      }
      
      video.appendChild(track);
    });
  }, [streamingData?.subtitles]);

  if (!streamingData || !videoSource) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-2">No video source available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      ref={playerContainerRef}
    >
      <ReactHlsPlayer
        src={videoSource}
        autoPlay={false}
        controls={false}
        playerRef={playerRef}
        width="100%"
        height="auto"
        onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
        onTimeUpdate={handleTimeUpdate}
        onPlaying={() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (hasNext && onNext) onNext();
        }}
        muted={isMuted}
        className="w-full h-full"
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between px-4 py-3 transition-opacity duration-300 ${
          controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
        } pointer-events-none`}
      >
        {/* Top controls */}
        <div className="flex justify-between items-center pointer-events-auto">
          <div className="text-white text-lg font-medium line-clamp-1">
            {/* Episode title could go here */}
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
            className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Center play/pause button */}
        <button 
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-600 p-4 rounded-full text-white pointer-events-auto transition-transform hover:scale-110"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        {/* Bottom controls */}
        <div className="space-y-3 pointer-events-auto">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{formatTime(currentTime)}</span>
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%)`,
              }}
            />
            <span className="text-white text-sm">{formatTime(duration)}</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-red-500"
                disabled={!videoSource}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button 
                onClick={onPrevious}
                className={`text-white hover:text-red-500 ${!hasPrevious ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hasPrevious}
              >
                <SkipBack size={24} />
              </button>
              
              <button 
                onClick={onNext}
                className={`text-white hover:text-red-500 ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hasNext}
              >
                <SkipForward size={24} />
              </button>
              
              <div className="flex items-center gap-2 ml-2">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-red-500"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, white ${volume * 100}%, #4b5563 ${volume * 100}%)`,
                  }}
                />
              </div>

              {streamingData.subtitles && streamingData.subtitles.length > 0 && (
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="text-white hover:text-red-500 ml-2"
                >
                  <Subtitles size={20} />
                </button>
              )}
            </div>
            
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-red-500"
            >
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Settings menu */}
      {isSettingsOpen && (
        <div className="absolute bottom-16 right-4 bg-gray-900/95 rounded-lg shadow-lg p-4 text-white pointer-events-auto">
          <h3 className="font-medium mb-2">Settings</h3>
          
          <div className="space-y-3">
            {streamingData.subtitles && streamingData.subtitles.length > 0 && (
              <div>
                <p className="text-sm text-gray-300 mb-1">Subtitles</p>
                <select 
                  className="bg-gray-800 rounded p-1 w-full text-sm"
                  value={activeSubtitle || ''}
                  onChange={(e) => {
                    const selectedLang = e.target.value;
                    setActiveSubtitle(selectedLang);
                    
                    const tracks = playerRef.current?.textTracks;
                    if (tracks && tracks.length > 0) {
                      for (let i = 0; i < tracks.length; i++) {
                        if (tracks[i].label === selectedLang) {
                          tracks[i].mode = 'showing';
                        } else {
                          tracks[i].mode = 'hidden';
                        }
                      }
                    }
                  }}
                >
                  <option value="">Off</option>
                  {streamingData.subtitles.map((sub, index) => (
                    <option key={sub.url} value={sub.lang}>
                      {sub.lang}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-300 mb-1">Playback Speed</p>
              <select 
                className="bg-gray-800 rounded p-1 w-full text-sm"
                onChange={(e) => {
                  if (playerRef.current) {
                    playerRef.current.playbackRate = parseFloat(e.target.value);
                  }
                }}
                defaultValue="1"
              >
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">Normal</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
