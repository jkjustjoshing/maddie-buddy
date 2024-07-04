import { KEY } from './const';

export const fetchApi = async (path: string, options: RequestInit = {}) => {
  const _options: RequestInit = {
    mode: 'cors',
    ...options,
    headers: {
      Authorization: 'Token ' + localStorage.getItem(KEY)?.trim(),
      ...(options.headers || {})
    }
  }

  const response = await fetch("https://babybuddy.jkjustjoshing.com/api" + path, _options);

  if (!response.ok) {
    throw new Error(await response.text())
  }

  const text = await response.text();
  if (!text) {
    return null
  }
  const data = JSON.parse(text)
  return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchApiPost = async (path: string, data: any) => {
  return fetchApi(path, {
    method: 'post',
    headers: data instanceof FormData ? undefined : {
      'Content-Type': 'application/json'
    },
    body: data instanceof FormData ? data : JSON.stringify(data)
  })
}
