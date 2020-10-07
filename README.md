<div align="center">

<h1>use-simple-infinite-scroll</h1>

<h3>A simple React Hook for infinite scrolling built on the Intersection Observer API</h3>

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Actions Status](https://github.com/kotarella1110/use-simple-infinite-scroll/workflows/Release/badge.svg)](https://github.com/kotarella1110/use-simple-infinite-scroll/actions?query=workflow%3ARelease)
[![NPM Version](https://img.shields.io/npm/v/use-simple-infinite-scroll?style=flat-square)](https://www.npmjs.com/package/use-simple-infinite-scroll)
[![Downloads Month](https://img.shields.io/npm/dm/use-simple-infinite-scroll?style=flat-square)](https://www.npmjs.com/package/use-simple-infinite-scroll)
[![Downloads Total](https://img.shields.io/npm/dt/use-simple-infinite-scroll?style=flat-square)](https://www.npmjs.com/package/use-simple-infinite-scroll)
[![Dependencies Status](https://david-dm.org/kotarella1110/use-simple-infinite-scroll.svg?style=flat-square)](https://david-dm.org/kotarella1110/use-simple-infinite-scroll)
[![Semantic Release](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg?style=flat-square)](CONTRIBUTING.md)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

</div>

## Installation

```sh
npm install use-simple-infinite-scroll
```

## Usage

[![Edit kotarella1110/use-simple-infinite-scroll: example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kotarella1110/use-simple-infinite-scroll/tree/master/example?fontsize=14&hidenavigation=1&theme=dark)

### Basic

```tsx
import React, { useState } from 'react';
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
  const [items, setItems] = useState<Item[]>([]);
  const [nextCursor, setNextCursor] = useState<Result['nextCursor']>(0);

  const fetchMore = () => {
    setIsLoading(true);
    fetch(`/api/items?cursor=${nextCursor}`)
      .then((res) => res.json())
      .then((res: Result) => {
        setItems([...items, ...res.data]);
        setNextCursor(res.nextCursor);
        setIsLoading(false);
      });
  };

  const [targetRef] = useSimpleInfiniteScroll({
    onLoadMore: fetchMore,
    canLoadMore: canFetchMore(nextCursor),
  });

  return (
    <>
      {items.length !== 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : null}
      <div ref={targetRef}>
        {isLoading
          ? 'Loading more...'
          : canFetchMore(nextCursor)
          ? 'Load More'
          : 'Nothing more to load'}
      </div>
    </>
  );
};
```

### React Query

```tsx
import React from 'react';
import { useInfiniteQuery } from 'react-query';
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
    'items',
    (key: string, cursor = 0) =>
      fetch(`/api/items?cursor=${cursor}`).then((res) => res.json()),
    {
      getFetchMore: (lastGroup) => lastGroup.nextCursor,
    },
  );

  const [targetRef, rootRef] = useSimpleInfiniteScroll({
    onLoadMore: fetchMore,
    canLoadMore: !!canFetchMore,
  });

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <span>Error: {error && error.message}</span>
  ) : (
    <div
      style={{
        overflow: 'auto',
      }}
      ref={rootRef}
    >
      <ul>
        {data &&
          data.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((item) => (
                <li key={itme.id}>{item.name}</li>
              ))}
            </React.Fragment>
          ))}
      </ul>
      <div>
        <button
          type="button"
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
      <div>
        {isFetching && !isFetchingMore ? 'Background Updating...' : null}
      </div>
    </div>
  );
};
```

## API

```ts
const useSimpleInfiniteScroll: (options: {
  canLoadMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number | number[];
}) => [(target: Element | null) => void, (root: Element | null) => void];
```

| Name          | Type                 | Default | Required | Descripttion                                                                                                                                           |
| :------------ | :------------------- | :------ | :------: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canLoadMore` | `boolean`            |         |    ✓     | Specifies if there are more entities to load.                                                                                                          |
| `onLoadMore`  | `() => void`         |         |    ✓     | Called when the user has scrolled all the way to the end.                                                                                              |
| `rootMargin`  | `string`             | `"0px"` |          | Margin around the root. Can have values similar to the CSS margin property, e.g. `"10px 20px 30px 40px"` (top, right, bottom, left).                   |
| `threshold`   | `number \| number[]` | `0`     |          | Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. |

For more information on `rootMargin` and `threshold` option, visit the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## IE11

You can install the [polyfill](https://www.npmjs.com/package/intersection-observer) via npm or by downloading a [zip](https://github.com/w3c/IntersectionObserver/archive/gh-pages.zip) of this repository:

```sh
npm install intersection-observer
```

Then import it in your app:

```js
import 'intersection-observer';
```

## Contributing

Contributions are always welcome! Please read the [contributing](./CONTRIBUTING.md) first.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://qiita.com/kotarella1110"><img src="https://avatars1.githubusercontent.com/u/12913947?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kotaro Sugawara</b></sub></a><br /><a href="https://github.com/kotarella1110/use-simple-infinite-scroll/commits?author=kotarella1110" title="Code">💻</a> <a href="https://github.com/kotarella1110/use-simple-infinite-scroll/commits?author=kotarella1110" title="Documentation">📖</a> <a href="#ideas-kotarella1110" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-kotarella1110" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kotarella1110/use-simple-infinite-scroll/commits?author=kotarella1110" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](./LICENSE) © [Kotaro Sugawara](https://twitter.com/kotarella1110)
