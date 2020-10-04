import React, { useState } from 'react';
import { useSimpleInfiniteScroll } from '../use-simple-infinite-scroll';

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
        (error) => {
          setError(error);
        },
      );
  };

  const [loadMoreButtonRef, containerRef] = useSimpleInfiniteScroll({
    onLoadMore: fetchMore,
    canLoadMore: canFetchMore(nextCursor),
  });

  return !items.length && isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <span>Error: {error.message}</span>
  ) : (
    <div
      style={{
        maxWidth: '500px',
        maxHeight: '500px',
        overflow: 'auto',
      }}
      ref={containerRef}
    >
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div>
        <button
          ref={loadMoreButtonRef}
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
  );
};

export default InfiniteScrollExample;
