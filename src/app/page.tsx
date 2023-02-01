import React from 'react';
import Parser from 'rss-parser';

// Assets
import LogoEcc from '../assets/svg/logo-error-code-coffee.svg';
import LogoCursief from '../assets/svg/logo-cursief.svg';

import IconSpotify from '../assets/svg/services/spotify.svg';
import IconApplePodcasts from '../assets/svg/services/apple-podcasts.svg';
import IconGooglePodcasts from '../assets/svg/services/google-podcasts.svg';
import IconRSS from '../assets/svg/services/rss.svg';

// Styles
import styles from './page.module.scss';
import Main from './Main';

// Init external modules
const parser = new Parser();

async function fetchRss() {
  const response = await fetch('https://anchor.fm/s/6a811cc/podcast/rss');

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return parser.parseString(await response.text());
}

export default async function Home() {
  const rss = await fetchRss();

  return (
    <>
      <header className={ styles.header }>
        <aside className={ styles.headerAside }>
          <p className={ styles.headerAsideText }>
            <span>Hosted by</span> <a href='https://twitter.com/gideonheilbron'>Gideon Heilbron</a> <span>/</span> <a href='https://twitter.com/mmousawy'>Murtada al Mousawy</a>
          </p>
        </aside>
        <div className={ styles.headerContent }>
          <a href='/' aria-label='Homepage' className={ styles.headerLogo }>
            <LogoEcc />
          </a>
          <p className={ styles.headerSubContent }><span>A podcast by</span> <a href='https://cursief.co'><LogoCursief className={ styles.headerSubContentLogo } /></a></p>

          <h1 className={ styles['heading-1'] }>Error Code: Coffee</h1>
          <h2 className={ styles.headerIntro }>A geeky podcast about tech, web development and all things life.</h2>

          <h2 className={ styles['heading-2'] }>About</h2>
          <p className={ styles.headerDescription }>
            In this weekly podcast, our mostly improvised conversations will take you to honest yet curious corners of various themes, including: web development, design, games, movies, UX design, mental health, life and much more!
          </p>

          <h2 className={ styles['heading-2'] }>Listen</h2>
          <ul className={ styles.servicesList }>
            <li>
              <a href='https://open.spotify.com/show/3I9fjgZMOJU5dsvtRzfh3L' target='_blank' rel='noopener noreferrer'>
                <span className={ styles.serviceIcon }><IconSpotify /></span> Spotify
              </a>
            </li>
            <li>
              <a href='https://itunes.apple.com/nl/podcast/error-code-coffee/id1433981170' target='_blank' rel='noopener noreferrer'>
                <span className={ styles.serviceIcon }><IconApplePodcasts /></span> Apple Podcasts
              </a>
            </li>
            <li>
              <a href='https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy82YTgxMWNjL3BvZGNhc3QvcnNz' target='_blank' rel='noopener noreferrer'>
                <span className={ styles.serviceIcon }><IconGooglePodcasts /></span> Google Podcasts
              </a>
            </li>
            <li>
              <a href='https://anchor.fm/s/6a811cc/podcast/rss' target='_blank' rel='noopener noreferrer'>
                <span className={ styles.serviceIcon }><IconRSS /></span> RSS feed
              </a>
            </li>
          </ul>
        </div>
      </header>
      <Main rss={ rss } />
    </>
  );
}
