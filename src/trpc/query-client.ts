// // query-client.ts
// import {
//   defaultShouldDehydrateQuery,
//   QueryClient,
// } from '@tanstack/react-query';
// import superjson from 'superjson';

// export function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // ✅ Cache Configuration
//         staleTime: 5 * 60 * 1000, // 5 minutes - data fresh consider hobe
//         gcTime: 10 * 60 * 1000, // 10 minutes - cache memory te thakbe (previously cacheTime)
        
//         // ✅ Refetch Configuration
//         refetchOnWindowFocus: false, // Window focus e auto refetch off
//         refetchOnMount: false, // Component mount e refetch off (if cached)
//         refetchOnReconnect: true, // Internet reconnect e refetch (keep true)
        
//         // ✅ Retry Configuration
//         retry: 1, // Failed query 1 bar retry korbe
//         retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        
//         // ✅ Network Configuration
//         networkMode: 'online', // Only online e queries run hobe
//       },
      
//       mutations: {
//         // ✅ Mutations normally cache hoy na, so retry off
//         retry: 0,
//         networkMode: 'online',
//       },
      
//       // ✅ Server-side hydration config (Next.js er jonno)
//       dehydrate: {
//         serializeData: superjson.serialize,
//         shouldDehydrateQuery: (query) =>
//           defaultShouldDehydrateQuery(query) ||
//           query.state.status === 'pending',
//       },
      
//       hydrate: {
//         deserializeData: superjson.deserialize,
//       },
//     },
//   });
// }

// query-client.ts
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ Cache Configuration - আরো aggressive caching
        staleTime: 10 * 60 * 1000, // 10 minutes - projects data frequently change hoy na
        gcTime: 30 * 60 * 1000, // 30 minutes - memory te longer time thakbe
        
        // ✅ Refetch Configuration - আরো conservative
        refetchOnWindowFocus: false, // Window focus এ auto refetch off
        refetchOnMount: false, // Component mount এ refetch off (cached data use করবে)
        refetchOnReconnect: false, // Internet reconnect এও refetch off
        
        // ✅ Retry Configuration
        retry: 2, // Failed query 2 bar retry করবে
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // ✅ Network Configuration
        networkMode: 'online',
      },
      
      mutations: {
        retry: 0,
        networkMode: 'online',
      },
      
      // ✅ Server-side hydration config
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}

// ✅ Query Key Factory - consistent keys er jonno
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters?: string) => [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  htmlCode: {
    all: ['htmlCode'] as const,
    lists: () => [...queryKeys.htmlCode.all, 'list'] as const,
    list: (category?: string) => [...queryKeys.htmlCode.lists(), { category }] as const,
  },
};