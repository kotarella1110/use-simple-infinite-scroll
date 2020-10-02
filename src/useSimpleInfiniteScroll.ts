import { useRef, useEffect, useCallback } from 'react';

type Options = {
  canLoadMore: boolean;
  onLoadMore: () => void;
} & Omit<IntersectionObserverInit, 'root'>;

// eslint-disable-next-line import/prefer-default-export
export const useSimpleInfiniteScroll = ({
  canLoadMore,
  onLoadMore,
  rootMargin,
  threshold,
}: Options): [
  (target: Element | null) => void,
  (root: Element | null) => void,
] => {
  const onLoadMoreRef = useRef(() => {});
  const rootMarginRef = useRef(rootMargin);
  const thresholdRef = useRef(threshold);
  const rootRef = useRef<Element | null>();
  const unobserveRef = useRef<() => void>();

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const setTargetRef = useCallback(
    (target: Element | null) => {
      if (unobserveRef.current) {
        unobserveRef.current();
        unobserveRef.current = undefined;
      }

      if (!target || !canLoadMore) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(
            ({ isIntersecting }) => isIntersecting && onLoadMoreRef.current(),
          );
        },
        {
          root: rootRef.current,
          rootMargin: rootMarginRef.current,
          threshold: thresholdRef.current,
        },
      );
      observer.observe(target);
      unobserveRef.current = () => observer.unobserve(target);
    },
    [canLoadMore],
  );

  const setRootRef = useCallback((root: Element | null) => {
    rootRef.current = root;
  }, []);

  return [setTargetRef, setRootRef];
};
