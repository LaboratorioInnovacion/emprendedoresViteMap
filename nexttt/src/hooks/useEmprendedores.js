import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useEmprendedores() {
  const { data, error, isLoading } = useSWR("/api/emprendedores", fetcher)

  return {
    data,
    isLoading,
    error,
  }
}

export function useEmprendedor(id) {
  const { data, error, isLoading } = useSWR(id ? `/api/emprendedores/${id}` : null, fetcher)

  return {
    data,
    isLoading,
    error,
  }
}
