import React from 'react';
import {
  QueryCache,
  ReactQueryCacheProvider,
  useInfiniteQuery,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
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

const InfiniteScrollExample = () => {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery<Result, Error>(
    'projects',
    (key: string, cursor = 0) =>
      fetch(`/api/items?cursor=${cursor}`).then((res) => res.json()),
    {
      getFetchMore: (lastGroup) => lastGroup.nextCursor,
    },
  );

  const [targetRef] = useSimpleInfiniteScroll({
    onLoadMore: fetchMore,
    canLoadMore: !!canFetchMore,
  });

  return (
    <div>
      <h1>Infinite Scroll List - React Query</h1>
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error && error.message}</span>
      ) : (
        <div
          style={{
            backgroundColor: '#e4e4e4',
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: '0.6rem',
            }}
          >
            {data &&
              data.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((project) => (
                    <li
                      style={{
                        backgroundColor: '#fafafa',
                        padding: '2rem 0.8rem',
                        marginBottom: '0.6rem',
                      }}
                      key={project.id}
                    >
                      {project.name}
                    </li>
                  ))}
                </React.Fragment>
              ))}
          </ul>
          <div
            style={{
              padding: '0.6rem',
            }}
          >
            <button
              ref={targetRef}
              onClick={() => fetchMore()}
              disabled={!canFetchMore || !!isFetchingMore}
            >
              {isFetchingMore
                ? 'Loading more...'
                : canFetchMore
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
          <div
            style={{
              padding: '0.6rem',
            }}
          >
            {isFetching && !isFetchingMore ? 'Background Updating...' : null}
          </div>
        </div>
      )}
      <hr />
      <Link href="/">
        <a>Go to Basic example</a>
      </Link>
      <ReactQueryDevtools />
    </div>
  );
};

const queryCache = new QueryCache();

const ReactQueryPage = () => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <InfiniteScrollExample />
  </ReactQueryCacheProvider>
);

export default ReactQueryPage;
