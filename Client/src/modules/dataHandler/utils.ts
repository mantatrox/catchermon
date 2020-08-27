const fetchOptions = (method: string, body?: unknown): RequestInit => {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      pragma: "no-cache",
      "cache-control": "no-cache"
    },
    body: body ? JSON.stringify(body) : undefined
  };
};

const getter = async <T>(url: string) => {
  const response = await fetch(url, fetchOptions("GET"));
  return (await response.json()).data as T;
};

const poster = async (url: string, body: unknown) => {
  return await fetch(url, fetchOptions("POST", body));
};

const putter = async (url: string, body: unknown) => {
  return await fetch(url, fetchOptions("PUT", body));
};

export { getter, poster, putter };
