import { useRef, useEffect, useCallback } from 'react';

type Options = {
  canLoadMore: boolean;
  onLoadMore: () => void;
} & Omit<IntersectionObserverInit, 'root'>;

const isIntersectionObserverAvailable = () =>
  typeof window !== 'undefined' && 'IntersectionObserver' in window;

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
  if (process.env.NODE_ENV !== 'production') {
    if (!isIntersectionObserverAvailable()) {
      throw new Error(
        'IntersectionObserver is not available. This could happen for one of the following reasons:\n' +
          '1. IntersectionObserver is not supported in your current browser\n' +
          "2. You're using the useSimpleInfiniteScroll hook whilst server side rendering\n" +
          'See https://github.com/kotarella1110/use-simple-infinite-scroll#which-browsers-are-supported for tips about how to add polyfill.',
      );
    }
  }

  const onLoadMoreRef = useRef(() => {});
  const rootMarginRef = useRef(rootMargin);
  const thresholdRef = useRef(threshold);
  const targetRef = useRef<Element | null>();
  const rootRef = useRef<Element | null>();
  const unobserveRef = useRef<() => void>();

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const observeTarget = useCallback(() => {
    if (unobserveRef.current) {
      unobserveRef.current();
      unobserveRef.current = undefined;
    }

    const target = targetRef.current;
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
  }, [canLoadMore]);

  const setTargetRef = useCallback(
    (target: Element | null) => {
      targetRef.current = target;
      observeTarget();
    },
    [observeTarget],
  );

  const setRootRef = useCallback(
    (root: Element | null) => {
      rootRef.current = root;
      observeTarget();
    },
    [observeTarget],
  );

  return [setTargetRef, setRootRef];
};
