import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useEmprendimientos() {
  const { data, error, isLoading } = useSWR("/api/emprendimientos", fetcher)

  return {
    data,
    isLoading,
    error,
  }
}

export function useEmprendimiento(id) {
  const { data, error, isLoading } = useSWR(id ? `/api/emprendimientos/${id}` : null, fetcher)

  return {
    data,
    isLoading,
    error,
  }
}
