'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './page.module.scss';

export default function LogButton(props: any) {
  const [ showMore, setShowMore ] = useState(false);
  const [ isTooBig, setIsTooBig ] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  function convertToHyperlinks(text: string) {
    const regex = /(https?:\/\/[^\s]+)/g;
    return text.replace(regex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function cleanEpisodeDescription(snippet: string) {
    snippet = convertToHyperlinks(snippet);

    return snippet
      .replace('\n', '\n\n')
      .split('---')[0]
      .replace(/\v+/g, ' ')
      .trim();
  }

  const resizeHandler = () => {
    if (!containerRef.current || !descriptionRef.current) {
      return;
    }

    if (containerRef.current?.clientHeight < descriptionRef.current.clientHeight) {
      setIsTooBig(true);
      containerRef.current.setAttribute('style', `max-height: ${ descriptionRef.current.clientHeight }px`);

    } else {
      setIsTooBig(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || !descriptionRef.current) {
      return;
    }

    resizeHandler();
    addEventListener('resize', resizeHandler);

    return () => {
      removeEventListener('resize', resizeHandler);
    };
  }, [ containerRef.current, descriptionRef.current ]);

  return (
    <>
      <div ref={ containerRef } className={ [
        styles.episodeDescriptionHolder,
        showMore ? styles.episodeDescriptionHolderOpen : styles.episodeDescriptionHolderClosed,
        isTooBig && !showMore ? styles.episodeDescriptionHolderTooBig : '',
      ].join(' ') }
      >
        <p ref={ descriptionRef } className={ styles.episodeDescription } dangerouslySetInnerHTML={
          { __html:
          cleanEpisodeDescription(props.contentSnippet || 'No description available.'),
          }
        } />

      </div>
      {isTooBig && (
        <button className={ styles.showMoreButton } onClick={ () => setShowMore(!showMore) }>{ !showMore ? 'Show more' : 'Show less'}</button>
      ) }
    </>
  );
}
