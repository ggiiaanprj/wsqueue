import type { ZodType } from "zod";

export const API_BASE_URL =
    import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";

export async function apiFetch<T>(
    path: string,
    schema: ZodType<T>,
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
        throw new Error(e.message ?? "Api response");
    }

    const data = await res.json();
    const validation = schema.safeParse(data);

    if (!validation.success) {
        console.error("Api response validation", validation.error.issues);
        throw new Error("Api response");
    }

    return validation.data;
}
