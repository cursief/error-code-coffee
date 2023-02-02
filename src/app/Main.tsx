'use client';

import React from 'react';

// Contexts
import PlayerContextProvider from './PlayerContext';

// Components
import LogButton from './LogButton';
import EpisodeDescription from './EpisodeDescription';
import EpisodeButton from './EpisodeButton';
import Player from './components/Player/Player';

// Styles
import styles from './page.module.scss';

export default function Main(props: any) {
  return (
    <PlayerContextProvider>
      <main className={ styles.main }>
        <>
          {/* <LogButton rss={ props.rss } /> */}
          <p className={ styles.mainHeading }>Episodes</p>
          { props.rss.items.map((episode: any) => (
            <React.Fragment key={ episode.guid }>
              { episode.isoDate && (
                <div className={ styles.episode }>
                  <div className={ styles.episodeContent }>
                    <time className={ styles.date } dateTime={ episode.isoDate }>{ new Date(episode.isoDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) }</time>
                    <h2 className={ styles.episodeHeading }>{ episode.title }</h2>
                    <div className={ [ styles.episodeDescriptionHolder, styles.episodeDescriptionHolderOpened ].join(' ') }></div>
                    <EpisodeDescription contentSnippet={ episode.contentSnippet } />
                    <EpisodeButton episode={ episode } />
                  </div>
                </div>
              ) }
            </React.Fragment>
          )) }
        </>
      </main>
      <Player />
    </PlayerContextProvider>
  );
}
