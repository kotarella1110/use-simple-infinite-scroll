import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import {
  intersectionMockInstance,
  mockIsIntersecting,
} from 'react-intersection-observer/test-utils';
import { useSimpleInfiniteScroll } from '../src';

describe('useSimpleInfiniteScroll', () => {
  let renderHookResult: RenderHookResult<
    {
      canLoadMore: boolean;
    },
    ((root: Element | null) => void)[]
  >;
  const onLoadMore = jest.fn();
  const target = document.createElement('div');

  beforeEach(() => {
    renderHookResult = renderHook(
      ({ canLoadMore }) =>
        useSimpleInfiniteScroll({
          onLoadMore,
          canLoadMore,
        }),
      {
        initialProps: {
          canLoadMore: true as boolean,
        },
      },
    );

    const [ref] = renderHookResult.result.current;
    ref(target);
  });

  it('should observe when canLoadMore is true', () => {
    const observer = intersectionMockInstance(target);

    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(observer.observe).toHaveBeenCalledWith(target);
  });

  it('should not observe when canLoadMore is false', () => {
    const observer = intersectionMockInstance(target);
    expect(observer.observe).toHaveBeenCalledTimes(1);

    const { rerender, result } = renderHookResult;
    rerender({ canLoadMore: false });
    const [ref] = result.current;
    ref(target);

    expect(observer.unobserve).toHaveBeenCalledTimes(1);
    expect(observer.unobserve).toHaveBeenCalledWith(target);
    expect(observer.observe).toHaveBeenCalledTimes(1);
  });

  it('should unobserve when target element is unmounted', () => {
    const observer = intersectionMockInstance(target);

    const { result } = renderHookResult;
    const [ref] = result.current;
    ref(null);

    expect(observer.unobserve).toHaveBeenCalledTimes(1);
    expect(observer.unobserve).toHaveBeenCalledWith(target);
  });

  it('should call onLoadMore when the target element intersect', () => {
    mockIsIntersecting(target, true);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
