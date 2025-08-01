import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function useHerramientas() {
  const { data, error, isLoading } = useSWR("/api/herramientas", fetcher)

  return {
    data,
    isLoading,
    error,
  }
}

export function useHerramienta(id) {
  const { data, error, isLoading } = useSWR(id ? `/api/herramientas/${id}` : null, fetcher)

  return {
    data,
    isLoading,
    error,
  }
}
