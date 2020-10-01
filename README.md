<h3 align="center">👷🏻‍♂️ under construction</h3>
<h1 align="center">use-simple-infinite-scroll</h1>

<h3 align="center">A simple React Hook for infinite scrolling built on the Intersection Observer API</h3>

<p align="center">
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square">
  </a>
  <a href="https://github.com/kotarella1110/use-simple-infinite-scroll/actions?query=workflow%3ACI">
    <img alt="Actions Status" src="https://github.com/kotarella1110/use-simple-infinite-scroll/workflows/CI/badge.svg">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="Semantic Release" src="https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
  </a>
  <a href="#contributors">
    <img alt="All Contributors" src="https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square">
  </a>
  <a href="CONTRIBUTING.md">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-green.svg?style=flat-square">
  </a>
</p>

## Installation

```
npm install use-simple-infinite-scroll

# or

yarn add use-simple-infinite-scroll
```

## Usage

```js
import { useInfiniteQuery } from 'react-query';
import { useSimpleInfiniteScroll } from 'use-simple-infinite-scroll';

function Projects() {
  const fetchProjects = (key, cursor = 0) =>
    fetch('/api/projects?cursor=' + cursor);

  const {
    status,
    data,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery('projects', fetchProjects, {
    getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
  });

  const [ref] = useSimpleInfiniteScroll({
    onLoadMore: fetchMore,
    canLoadMore: canFetchMore,
  });

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.map((group, i) => (
        <React.Fragment key={i}>
          {group.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          ref={ref}
          onClick={() => fetchMore()}
          disabled={!canFetchMore || isFetchingMore}
        >
          {isFetchingMore
            ? 'Loading more...'
            : canFetchMore
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingMore ? 'Fetching...' : null}</div>
    </>
  );
}
```

## API

| Name | Type | Default | Required | Descripttion |
|:---|:---|:---|:---:|:---|
| `canLoadMore` | `boolean` |  | ✓ | Specifies if there are more entities to load. |
| `onLoadMore` | `() => void` |  | ✓ | Called when the user has scrolled all the way to the end. |
| `rootMargin` | `string` | `"0px"` |  | Margin around the root. Can have values similar to the CSS margin property, e.g. `"10px 20px 30px 40px"` (top, right, bottom, left). |
| `threshold` | `number \| number[]` | `0` |  | Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. |

For more information on `rootMargin` and `threshold` option, visit the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

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
