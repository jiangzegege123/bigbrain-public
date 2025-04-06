export async function apiFetch(endpoint: string, options = {}) {
  const res = await fetch(`http://localhost:5005${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Unknown error");
  return data;
}
