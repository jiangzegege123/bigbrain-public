import { apiFetch } from "@/lib/utils";

export const adminRegister = async (
  email: string,
  name: string,
  password: string
) => {
  return apiFetch("/admin/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });
};

export const adminLogin = async (email: string, password: string) => {
  return apiFetch("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};
