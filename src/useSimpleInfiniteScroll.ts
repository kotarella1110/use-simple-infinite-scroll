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
  const rootRef = useRef<Element | null>();
  const targetRef = useRef<Element | null>();
  const unobserveRef = useRef<() => void>();

  const observeTarget = useCallback(
    (target?: Element | null, root?: Element | null) => {
      if (unobserveRef.current) {
        unobserveRef.current();
        unobserveRef.current = undefined;
      }

      if (!target || !canLoadMore) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach(
            (entry) => entry.isIntersecting && onLoadMoreRef.current(),
          ),
        {
          root,
          rootMargin,
          threshold,
        },
      );
      observer.observe(target);
      unobserveRef.current = () => observer.unobserve(target);
    },
    [canLoadMore, rootMargin, threshold],
  );

  const setRootRef = useCallback(
    (root: Element | null) => {
      observeTarget(targetRef.current, root);
      rootRef.current = root;
    },
    [observeTarget],
  );

  const setTargetRef = useCallback(
    (target: Element | null) => {
      observeTarget(target, rootRef.current);
      targetRef.current = target;
    },
    [observeTarget],
  );

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  return [setTargetRef, setRootRef];
};
