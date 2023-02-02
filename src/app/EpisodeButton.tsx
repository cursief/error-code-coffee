'use client';

import { useContext } from 'react';

// Contexts
import { PlayerContext } from './PlayerContext';

// Assets
import IconPlay from '../assets/svg/play.svg';

// Styles
import styles from './page.module.scss';

export default function EpisodeButton(props: any) {
  const playerContext = useContext(PlayerContext);
  const duration = props.episode.itunes.duration;

  return (
    <>
      <button className={ styles.playButton } aria-label={ `Play ${ props.episode.title }` } onClick={ () => playerContext.load(props.episode) }>
        <IconPlay className={ styles.playIcon } /> <span aria-hidden='true'>Listen [{ duration }]</span>
      </button>
    </>
  );
}
