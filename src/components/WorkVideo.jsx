import { useState } from 'react'
import { useVideoSlot } from '../motion/MotionProvider.jsx'
import { mediaUrl } from '../config/media.js'

// Plays the file directly. If the browser cannot decode it, say so instead of showing a dead player.
export default function WorkVideo({ item }) {
  const [failed, setFailed] = useState(false)
  const { videoRef, activate, deactivate } = useVideoSlot(`gallery-${item.id}`, 10, { autoPlay: false })
  const playbackSrc = item.playbackSrc ?? item.src
  const checkPicture = (e) => {
    if (e.currentTarget.videoWidth === 0) setFailed(true) // audio decoded but no picture
  }

  return (
    <li className="work-video">
      <div className="work-video__frame">
        {failed ? (
          <div className="work-video__fail" role="alert">
            <p>
              This browser could not play this video.
              {item.playbackCodec ? ` Playback codec: ${item.playbackCodec}.` : ''} Most often the cause is a codec the browser does not
              support, such as HEVC (H.265) in a .MOV file. Converting it to an H.264 MP4 usually fixes this.
            </p>
            <a href={playbackSrc}>Open the video file</a>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            preload="metadata"
            playsInline
            poster={item.file === 'IMG_1379.MOV' ? mediaUrl('/Media/Portfolio/IMG_1379-preview.jpg') : undefined}
            src={`${playbackSrc}#t=0.1`}
            aria-label={item.label}
            onPointerDown={activate}
            onError={() => setFailed(true)}
            onPlay={activate}
            onPause={deactivate}
            onLoadedMetadata={checkPicture}
          />
        )}
      </div>
      <p className="work-video__label">{item.label}</p>
    </li>
  )
}
