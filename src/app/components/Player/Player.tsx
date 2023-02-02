'use client';

import { useCallback, useContext, useRef, useState } from 'react';

// Contexts
import { PlayerContext } from '../../PlayerContext';

// Assets
import IconPlay from '@/assets/svg/player/play.svg';
import IconPause from '@/assets/svg/player/pause.svg';
import IconLoading from '@/assets/svg/player/loading.svg';
import IconSpeedOne from '@/assets/svg/player/speed-1.svg';
import IconSpeedOnePointFive from '@/assets/svg/player/speed-1.5.svg';
import IconSpeedTwo from '@/assets/svg/player/speed-2.svg';

import styles from './Player.module.scss';

function formatTime(seconds: number) {
  let minutesConverted: number|string = Math.floor(seconds / 60);
  minutesConverted = (minutesConverted >= 10) ? minutesConverted : '0' + minutesConverted;

  let secondsConverted: number|string = Math.floor(seconds % 60);
  secondsConverted = (secondsConverted >= 10) ? secondsConverted : '0' + secondsConverted;
  return minutesConverted + ':' + secondsConverted;
}

export default function Player() {
  const [ hover, setHover ] = useState(false);
  const playerContext = useContext(PlayerContext);

  const seekBarRef = useRef<HTMLDivElement>(null);

  const playOrPause = () => {
    if (playerContext.paused) {
      playerContext.audio.play();
    } else {
      playerContext.audio.pause();
    }
  };

  const startDrag = (event: React.TouchEvent|React.MouseEvent) => {
    event.preventDefault(); // prevent selection start (browser action)
    playerContext.updateProgressVisual(event, seekBarRef.current);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event: MouseEvent) {
      playerContext.updateProgressVisual(event, seekBarRef.current);
    }

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      playerContext.setRequestUpdateProgress(true);
    }
  };

  const renderProgressInTime = useCallback(() => {
    const progressTime = formatTime(playerContext.progress);
    return `${ progressTime }`;
  }, [ playerContext.progress, playerContext.duration ]);

  const progressPercentage = (playerContext.newProgress !== -1)
    ? (playerContext.newProgress / playerContext.duration) * 100
    : (playerContext.progress / playerContext.duration) * 100;

  return (
    <>
      <div
        className={ [ styles.player, playerContext.loading ? styles.playerLoading : '' ].join(' ') }
        style={ { transform: playerContext.episode ? '' : 'translateY(100%)' } }
      >
        <button
          onClick={ playOrPause }
          aria-label={ playerContext.paused ? 'Play' : 'Pause' }
          className={ styles.playButton }
        >
          { playerContext.loading
            ? <IconLoading aria-hidden />
            : ( playerContext.paused
              ? <IconPlay aria-hidden />
              : <IconPause aria-hidden style={ { width: '20px', height: '20px' } } />
            )
          }
        </button>
        <div className={ styles.playerContent }>
          <p className={ styles.playerTitle }>{ playerContext.episode?.title || '' }</p>
          <div className={ styles.playerControls }>
            <div ref={ seekBarRef } className={ styles.playerSeekbar } onTouchStart={ startDrag } onMouseDown={ startDrag } onMouseEnter={ () => setHover(true) } onMouseLeave={ () => setHover(false) }>
              <div className={ styles.playerSeekbarBackground }>
                <div className={ styles.playerSeekbarProgress } style={ { width: `calc(${ progressPercentage }% - ${ hover ? '.375rem' : '.3125rem' } )` } }></div>
              </div>
              <div className={ styles.playerSeekbarPosition } style={ { left: `${ progressPercentage }%` } }>
                <div className={ styles.playerSeekbarThumb } data-seekbar-thumb />
              </div>
            </div>
            <div className={ styles.playerTime }>
              <span>{ formatTime(playerContext.newProgress !== -1 ? playerContext.newProgress : playerContext.progress) }</span> / <span>{ formatTime(playerContext.duration) }</span>
            </div>
            <div className={ styles.playerPlaybackSpeed }>
              <button onClick={ playerContext.togglePlaybackSpeed }>
                { playerContext.playbackSpeed === 1 && (
                  <IconSpeedOne className={ styles.playerPlaybackSpeedIcon } />
                ) }
                { playerContext.playbackSpeed === 1.5 && (
                  <IconSpeedOnePointFive className={ styles.playerPlaybackSpeedIcon } />
                ) }
                { playerContext.playbackSpeed === 2 && (
                  <IconSpeedTwo className={ styles.playerPlaybackSpeedIcon } />
                ) }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
