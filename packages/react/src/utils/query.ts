import {
  type DefaultError,
  type QueryKey,
  replaceEqualDeep,
  useQuery as tanstack_useQuery,
} from '@tanstack/react-query'
import {
  type Evaluate,
  type ExactPartial,
  type Omit,
  deepEqual,
} from '@wagmi/core/internal'
import { hashFn } from '@wagmi/core/query'

export type UseMutationOptions<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
> = Evaluate<
  Omit<
    import('@tanstack/react-query').UseMutationOptions<
      data,
      error,
      Evaluate<variables>,
      context
    >,
    'mutationFn' | 'mutationKey' | 'throwOnError'
  >
>

export type UseMutationResult<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
> = Evaluate<
  Omit<
    import('@tanstack/react-query').UseMutationResult<
      data,
      error,
      variables,
      context
    >,
    'mutate' | 'mutateAsync'
  >
>

export type UseQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = Evaluate<
  ExactPartial<
    Omit<
      import('@tanstack/react-query').UseQueryOptions<
        queryFnData,
        error,
        data,
        queryKey
      >,
      | 'initialData'
      | 'queryFn'
      | 'queryHash'
      | 'queryKey'
      | 'queryKeyHashFn'
      | 'suspense'
      | 'throwOnError'
    >
  > & {
    // Fix `initialData` type
    initialData?: import('@tanstack/react-query').UseQueryOptions<
      queryFnData,
      error,
      data,
      queryKey
    >['initialData']
  }
>

export type UseQueryResult<data = unknown, error = DefaultError> = Evaluate<
  import('@tanstack/react-query').UseQueryResult<data, error> & {
    queryKey: QueryKey
  }
>

// Adding some basic customization.
// Ideally we don't have this function, but `import('@tanstack/react-query').useQuery` currently has some quirks where it is super hard to
// pass down the inferred `initialData` type because of it's discriminated overload in the on `useQuery`.
export function useQuery<queryFnData, error, data, queryKey extends QueryKey>(
  parameters: UseQueryParameters<queryFnData, error, data, queryKey> & {
    queryKey: QueryKey
  },
): UseQueryResult<data, error> {
  const result = tanstack_useQuery({
    ...(parameters as any),
    queryKeyHashFn: hashFn, // for bigint support
  }) as UseQueryResult<data, error>
  result.queryKey = parameters.queryKey
  return result
}

export function structuralSharing<data>(
  oldData: data | undefined,
  newData: data,
): data {
  if (deepEqual(oldData, newData)) return oldData as data
  return replaceEqualDeep(oldData, newData)
}