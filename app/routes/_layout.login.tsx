import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { KEY } from "~/utils/const";

export const clientLoader = async () => {
  const token = localStorage.getItem(KEY);

  return { token };
};

export default function Login() {
  const data = useLoaderData<{ token: string | null }>();

  const [value, setValue] = useState(data.token || "");

  const setLocalStorage = () => {
    localStorage.setItem(KEY, value);
    window.location.href = "/";
  };

  return (
    <div>
      <p>Set the baby buddy token below</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={setLocalStorage}>Save token</button>
    </div>
  );
}
