import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Block, Elem } from "../../utils/bem";
import { isDefined } from "../../utils/helpers";
import { Spinner } from "../../components/Spinner/Spinner";
import "./InfiniteList.styl";

export const InfiniteList = ({
  className,
  children,
  loadNext,
  itemsCount = 0,
  totalCount = 0,
  treshold = 100,
}) => {
  const root = useRef();

  let prevScroll = useRef(root.current?.scrollTop);
  let endReached = useRef(false);
  const [loading, setLoading] = useState(false);

  const askLoadMore = useCallback(async () => {
    if (itemsCount < totalCount) {
      setLoading(true);
      await loadNext();
      setLoading(false);
    }
  }, [itemsCount, totalCount, loadNext]);

  const updateEndReached = useCallback((state) => {
    if (endReached.current !== state) {
      endReached.current = state;

      if (state === true) askLoadMore();
    }
  }, [askLoadMore]);

  // Reset endReached if items are changed
  useMemo(() => {
    updateEndReached(false);
  }, [itemsCount]);

  const handleScroll = useCallback((elem) => {
    if (loading) return;

    const currentScroll = elem.scrollTop;
    const height = elem.clientHeight;

    const maxScroll = elem.scrollHeight - treshold;
    const fullScroll = currentScroll + height;

    if (currentScroll > prevScroll.current) {
      if (!endReached.current) updateEndReached(fullScroll >= maxScroll);
    } else if (fullScroll > maxScroll) {
      if (!endReached.current) updateEndReached(fullScroll >= maxScroll);
    } else {
      updateEndReached(false);
    }

    prevScroll.current = currentScroll;
  }, [updateEndReached, loading]);

  useEffect(() => {
    if (isDefined(root.current)) {
      handleScroll(root.current, true);
    }
  }, [root.current]);

  return (
    <Block
      ref={root}
      name="infinite-list"
      mix={className}
      onScroll={(e) => handleScroll(e.target)}
    >
      {children}
      {loading && (
        <Elem name="loading">
          <Spinner size={24} />
        </Elem>
      )}
    </Block>
  );
};
