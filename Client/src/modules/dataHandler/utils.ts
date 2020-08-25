const postOptions = (body: unknown): RequestInit => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
};

const putOptions = (body: unknown): RequestInit => {
  return {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
};

const getter = async <T>(url: string) => {
  const response = await fetch(url);
  return (await response.json()).data as T;
};

const poster = async (url: string, body: unknown) => {
  return await fetch(url, postOptions(body));
};

const putter = async (url: string, body: unknown) => {
  return await fetch(url, putOptions(body));
};

export { getter, poster, putter };
