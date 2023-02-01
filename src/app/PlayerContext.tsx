'use client';

import React, { createContext, SyntheticEvent, useEffect, useState } from 'react';

export const PlayerContext = createContext<any>(null);

export default function PlayerContextProvider({ children }: { children: any }) {
  const [ episode, setEpisode ] = useState();
  const [ audio, setAudio ] = useState<HTMLAudioElement>();
  const [ paused, setPaused ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ duration, setDuration ] = useState(0);

  useEffect(() => {
    const pauseHandler = () => setPaused(true);
    const playHandler = () => setPaused(false);
    const timeUpdateHandler = (event: any) => {
      setProgress(event.target?.currentTime || 0);
      setDuration(event.target?.duration || 0);

      console.log(event);
    };

    if (!audio) {
      const newAudio = new Audio();
      newAudio.addEventListener('pause', pauseHandler);
      newAudio.addEventListener('play', playHandler);
      newAudio.addEventListener('timeupdate', timeUpdateHandler);

      setAudio(newAudio);
    }

    return () => {
      audio?.removeEventListener('pause', pauseHandler);
    };
  }, []);

  useEffect(() => {
    console.log(paused ? 'Paused' : 'Playing');
  }, [ paused ]);

  const load = (episode: any) => {
    if (!audio) {
      return;
    }

    setEpisode(episode);
    setProgress(0);
    audio.pause();

    setTimeout(() => {
      audio.src = episode.enclosure.url;
      audio.play();
    }, 10);
  };

  const updateProgress = (event: MouseEvent) => {
    if (!audio) {
      return;
    }

    const target: HTMLDivElement = event.target as HTMLDivElement;

    if (target.dataset.seekbarThumb) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;

    audio.currentTime = audio?.duration * percentage;
    setProgress(audio.currentTime);

    console.log(event.clientX - rect.left, event.clientY - rect.top);

    event.stopPropagation();
  };

  const state = {
    audio,
    load,
    paused,
    episode,
    progress,
    duration,
    updateProgress,
  };

  return (
    <>
      <PlayerContext.Provider value={ state }>
        { children }
      </PlayerContext.Provider>
    </>
  );
}
