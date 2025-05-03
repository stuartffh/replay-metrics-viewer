
import React, { useRef, useEffect } from 'react';

interface ReplayVideoProps {
  replayUrl: string;
}

const ReplayVideo: React.FC<ReplayVideoProps> = ({ replayUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set up the iframe when the component mounts
    if (iframeRef.current) {
      iframeRef.current.src = replayUrl;
    }
  }, [replayUrl]);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-secondary/20">
      <iframe
        ref={iframeRef}
        title="Game Replay"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default ReplayVideo;
