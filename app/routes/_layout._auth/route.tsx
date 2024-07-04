import { Outlet } from "@remix-run/react";
import { KEY } from "~/utils/const";

export const clientLoader = async () => {
  const token = localStorage.getItem(KEY);
  if (!token) {
    window.location.href = "/login";
  }

  return null;
};

export default Outlet;
