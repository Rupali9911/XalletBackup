import React from 'react';

export const useRefresh = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isRefreshing) {
        setIsRefreshing(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRefreshing]);

  return [
    isRefreshing,
    () => {
      setIsRefreshing(true);
    },
  ];
};
