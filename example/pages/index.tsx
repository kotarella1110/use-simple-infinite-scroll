/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import Link from 'next/link';
import { useSimpleInfiniteScroll } from 'use-simple-infinite-scroll';

type Item = {
  id: number;
  name: string;
};

type Result = {
  data: Item[];
  nextCursor: number | null;
};

const canFetchMore = (nextCursor: Result['nextCursor']) => nextCursor !== null;

const InfiniteScrollExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = React.useState<Error>();
  const [items, setItems] = useState<Item[]>([]);
  const [nextCursor, setNextCursor] = useState<Result['nextCursor']>(0);

  const fetchMore = () => {
    setIsLoading(true);
    fetch(`/api/items?cursor=${nextCursor}`)
      .then((res) => res.json())
      .then(
        (res: Result) => {
          setItems([...items, ...res.data]);
          setNextCursor(res.nextCursor);
          setIsLoading(false);
        },
        (e: Error) => setError(e),
      );
  };

  const [targetRef, rootRef] = useSimpleInfiniteScroll({
    onLoadMore: fetchMore,
    canLoadMore: canFetchMore(nextCursor),
  });

  return (
    <div>
      <h1>Infinite Scroll List - Basic</h1>
      {items.length && isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <span>Error: {error.message}</span>
      ) : (
        <div
          style={{
            maxWidth: '500px',
            maxHeight: '500px',
            overflow: 'auto',
            backgroundColor: '#e4e4e4',
          }}
          ref={rootRef}
        >
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: '0.6rem',
            }}
          >
            {items.map((item) => (
              <li
                style={{
                  backgroundColor: '#fafafa',
                  padding: '2rem 0.8rem',
                  marginBottom: '0.6rem',
                }}
                key={item.id}
              >
                {item.name}
              </li>
            ))}
          </ul>
          <div
            style={{
              padding: '0.6rem',
            }}
          >
            <button
              type="button"
              ref={targetRef}
              onClick={() => fetchMore()}
              disabled={!canFetchMore(nextCursor) || !!isLoading}
            >
              {isLoading
                ? 'Loading more...'
                : canFetchMore(nextCursor)
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
        </div>
      )}
      <hr />
      <Link href="/react-query">
        <a>Go to React Query example</a>
      </Link>
    </div>
  );
};

const BasicPage = () => <InfiniteScrollExample />;

export default BasicPage;
