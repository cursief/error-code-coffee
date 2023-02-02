'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';

export const PlayerContext = createContext<any>(null);

export default function PlayerContextProvider({ children }: { children: any }) {
  const [ episode, setEpisode ] = useState();
  const [ audio, setAudio ] = useState<HTMLAudioElement>();
  const [ loading, setLoading ] = useState(false);
  const [ paused, setPaused ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ playbackSpeed, setPlaybackSpeed ] = useState(1);
  const [ newProgress, setNewProgress ] = useState(-1);
  const [ requestUpdateProgress, setRequestUpdateProgress ] = useState(false);
  const [ duration, setDuration ] = useState(0);

  const pauseHandler = () => setPaused(true);
  const playHandler = () => setPaused(false);
  const timeUpdateHandler = (event: any) => {
    setProgress(event.target?.currentTime || 0);
    setDuration(event.target?.duration || 0);
  };

  const canPlayThroughHandler = (event: any) => {
    setLoading(false);
  };

  useEffect(() => {
    const waitingHandler = () => {
      setLoading(true);
    };

    if (!audio) {
      const newAudio = new Audio();
      newAudio.addEventListener('pause', pauseHandler);
      newAudio.addEventListener('play', playHandler);
      newAudio.addEventListener('timeupdate', timeUpdateHandler);
      newAudio.addEventListener('waiting', waitingHandler);
      newAudio.addEventListener('canplaythrough', canPlayThroughHandler);

      setAudio(newAudio);
    }

    return () => {
      if (!audio) {
        return;
      }

      audio.removeEventListener('pause', pauseHandler);
      audio.removeEventListener('play', playHandler);
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('waiting', waitingHandler);
      audio.addEventListener('canplaythrough', canPlayThroughHandler);
    };
  }, []);

  useEffect(() => {
    console.log(paused ? 'Paused' : 'Playing');
  }, [ paused ]);

  useEffect(() => {
    console.log(loading ? 'Loading' : 'Done');
  }, [ loading ]);

  const load = (episode: any) => {
    if (!audio) {
      return;
    }

    setEpisode(episode);
    setLoading(true);
    setProgress(0);
    audio.pause();

    setTimeout(() => {
      audio.src = episode.enclosure.url;
      audio.load();
      audio.playbackRate = playbackSpeed;
      audio.play();
    }, 10);
  };

  const updateProgressVisual = (event: MouseEvent, seekBar: HTMLDivElement) => {
    if (!audio) {
      return;
    }

    const rect = seekBar.getBoundingClientRect();
    let percentage = (event.clientX - rect.left) / rect.width;
    percentage = Math.min(Math.max(percentage, 0), 1);

    setNewProgress(audio.duration * percentage);

    event.stopPropagation();
  };

  const togglePlaybackSpeed = () => {
    setPlaybackSpeed(playbackSpeed === 2 ? 1 : playbackSpeed + .5);
  };

  useEffect(() => {
    if (!audio || !requestUpdateProgress || newProgress === -1) {
      return;
    }

    audio.currentTime = newProgress;
    setProgress(newProgress);
    setRequestUpdateProgress(false);
    setNewProgress(-1);
  }, [ audio, newProgress, requestUpdateProgress ]);

  useEffect(() => {
    if (!audio) {
      return;
    }

    audio.playbackRate = playbackSpeed;

  }, [ audio, playbackSpeed ]);

  const state = {
    audio,
    load,
    loading,
    paused,
    episode,
    progress,
    newProgress,
    duration,
    updateProgressVisual,
    setRequestUpdateProgress,
    playbackSpeed,
    togglePlaybackSpeed,
  };

  return (
    <>
      <PlayerContext.Provider value={ state }>
        { children }
      </PlayerContext.Provider>
    </>
  );
}
