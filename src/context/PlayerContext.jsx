import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = (id) => {
        setTrack(songsData[id]);
        setPlayStatus(true);
    };

    const previous = () => {
        if (track.id > 0) {
            setTrack(songsData[track.id - 1]);
            setPlayStatus(true);
        }
    };

    const next = () => {
        if (track.id < songsData.length - 1) {
            setTrack(songsData[track.id + 1]);
            setPlayStatus(true);
        }
    };

    const seekSong = (e) => {
        if (!audioRef.current || !seekBg.current || !audioRef.current.duration) return;

        const clickX = e.nativeEvent.offsetX;
        const width = seekBg.current.offsetWidth;
        const duration = audioRef.current.duration;

        audioRef.current.currentTime = (clickX / width) * duration;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (!seekBar.current || !audio.duration) return;

            const progress = (audio.currentTime / audio.duration) * 100;
            seekBar.current.style.width = `${Math.floor(progress)}%`;

            setTime({
                currentTime: {
                    second: Math.floor(audio.currentTime % 60),
                    minute: Math.floor(audio.currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(audio.duration % 60),
                    minute: Math.floor(audio.duration / 60)
                }
            });
        };

        audio.ontimeupdate = handleTimeUpdate;

        return () => {
            audio.ontimeupdate = null;
        };
    }, []);

    useEffect(() => {
        const playAudio = async () => {
            if (audioRef.current && playStatus) {
                try {
                    await audioRef.current.play();
                } catch (err) {
                    console.error("Playback error:", err);
                }
            }
        };
        playAudio();
    }, [track]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
            <audio ref={audioRef} src={track.file} preload="metadata" />
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
