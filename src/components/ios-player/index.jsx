/** React imports */
import React, { useState, useRef, useEffect } from 'react'

/** Library */
import Video from 'react-native-video'

/** Main Export */
const IosPlayer = ({ IosUrl, SetIosUrl }) => {

    const player = useRef(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const exitPlayer = () => {
        SetIosUrl(null)
    }

    useEffect(() => {
        if (player.current && IosUrl?.url) {
            player.current.seek(0)
            setTimeout(() => {
                player.current.setFullScreen(true)
                setIsFullscreen(true)
            }, 500)
        }
    }, [IosUrl])

    return (
        IosUrl?.url ?
        <Video
            source={{ uri: encodeURI(IosUrl.url) }}
            ref={player}
            onError={exitPlayer}
            onFullscreenPlayerDidDismiss={exitPlayer}
            volume={0.75}
            ignoreSilentSwitch="ignore"
            paused={!isFullscreen}
        /> : null
    )
}

export default IosPlayer