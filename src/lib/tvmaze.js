const BASE_URL = "https://api.tvmaze.com";

function toErrorMessage(err) {
  if (!err) return "Unknown error";
  if (err.name === "AbortError") return "Request cancelled";
  if (typeof err.message === "string") return err.message;
  return String(err);
}


export async function fetchShowsPage(page, { signal } = {}) {
  const url = `${BASE_URL}/shows?page=${page}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`TVMaze error ${res.status} for ${url}`);
  return res.json();
}

export async function searchShowsByName(query, { signal } = {}) {
  const q = query.trim();
  if (!q) return [];
  const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`TVMaze error ${res.status} for ${url}`);
  const data = await res.json();
  // Normalize to show objects (each entry: { score, show })
  return data.map((x) => x.show).filter(Boolean);
}

export { toErrorMessage };

