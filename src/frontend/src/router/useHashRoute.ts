import { useState, useEffect } from 'react';

export interface RouteParams {
  [key: string]: string;
}

export interface HashRoute {
  route: string;
  params: RouteParams;
  query: RouteParams;
}

export function useHashRoute(): HashRoute {
  const [hashRoute, setHashRoute] = useState<HashRoute>(parseHash());

  useEffect(() => {
    const handleHashChange = () => {
      setHashRoute(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hashRoute;
}

function parseHash(): HashRoute {
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) {
    return { route: '/', params: {}, query: {} };
  }

  // Split path and query string
  const [pathPart, queryPart] = hash.split('?');
  
  // Parse path params (e.g., /product/123 -> { id: '123' })
  const pathSegments = pathPart.split('/').filter(Boolean);
  const route = pathSegments.length > 0 ? `/${pathSegments[0]}` : '/';
  
  const params: RouteParams = {};
  if (pathSegments.length > 1) {
    params.id = pathSegments[1];
  }

  // Parse query string
  const query: RouteParams = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
  }

  return { route, params, query };
}

export function navigate(path: string, params?: RouteParams) {
  let hash = path;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    hash += `?${queryString}`;
  }
  window.location.hash = hash;
}
