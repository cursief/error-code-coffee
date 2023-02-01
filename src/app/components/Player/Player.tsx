'use client';

import { useContext, useEffect } from 'react';

// Contexts
import { PlayerContext } from '../../PlayerContext';

// Assets
import IconPlay from '@/assets/svg/player/play.svg';
import IconPause from '@/assets/svg/player/pause.svg';

import styles from './Player.module.scss';

export default function Player() {
  const playerContext = useContext(PlayerContext);

  const playOrPause = () => {
    if (playerContext.paused) {
      playerContext.audio.play();
    } else {
      playerContext.audio.pause();
    }
  };

  const progressPercentage = (playerContext.progress / playerContext.duration) * 100;

  return (
    <>
      <div className={ styles.player } style={ { transform: playerContext.episode ? '' : 'translateY(100%)' } }>
        <button
          onClick={ playOrPause }
          aria-label={ playerContext.paused ? 'Play' : 'Pause' }
          className={ styles.playButton }
        >
          {
            playerContext.paused
              ? <IconPlay aria-hidden />
              : <IconPause aria-hidden style={ { width: '20px', height: '20px' } } />
          }
        </button>
        <div className={ styles.playerContent }>
          <p className={ styles.playerTitle }>{ playerContext.episode?.title || '' }</p>
          <div className={ styles.playerControls }>
            <div className={ styles.playerSeekbar } onClick={ playerContext.updateProgress }>
              <div className={ styles.playerSeekbarProgress } style={ { width: `calc(${ progressPercentage }% - .3rem )` } }></div>
              <div className={ styles.playerSeekbarPosition } style={ { left: `${ progressPercentage }%` } }>
                <div className={ styles.playerSeekbarThumb } data-seekbar-thumb />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
