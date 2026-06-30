export const API_BASE_URL =
    import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";

export async function apiFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const e = await res.json().catch(() => ({ message: res.statusText }));
        return e.message;
    }

    return res.json() as Promise<T>;
}
