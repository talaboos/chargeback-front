import { useState, useEffect } from 'react';

export const useIndent = () => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const resizeHandler = () => {
      // viewport height
      const viewportHeight = window?.visualViewport?.height ?? 0;
      setTop(viewportHeight + window?.scrollY);
    };

    resizeHandler();

    window?.visualViewport?.addEventListener('resize', resizeHandler);
    window?.visualViewport?.addEventListener('scroll', resizeHandler);
    window?.addEventListener('touchmove', resizeHandler);

    return () => {
      window.visualViewport?.removeEventListener('resize', resizeHandler);
      window.visualViewport?.removeEventListener('scroll', resizeHandler);
      window?.removeEventListener('touchmove', resizeHandler);
    };
  }, []);

  return { top };
};

export default useIndent;
