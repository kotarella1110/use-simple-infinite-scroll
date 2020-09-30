import { useRef, useEffect } from 'react';

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
}: Options) => {
  const onLoadMoreRef = useRef(() => {});
  const rootRef = useRef<Element>();
  const targetRef = useRef<Element>();

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const target = targetRef?.current;

    if (!canLoadMore || !target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) => entry.isIntersecting && onLoadMoreRef?.current(),
        ),
      {
        root: rootRef?.current,
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    // eslint-disable-next-line consistent-return
    return () => observer.unobserve(target);
  }, [canLoadMore, rootMargin, threshold]);

  return [targetRef, rootRef];
};
