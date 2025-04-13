import { apiFetch } from "@/lib/utils";

/**
 * Register a new admin user.
 *
 * @param email - Admin's email address
 * @param name - Admin's display name
 * @param password - Password for the account
 * @returns A Promise resolving to the API response (usually containing a token)
 */
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

/**
 * Log in an existing admin user.
 *
 * @param email - Admin's email address
 * @param password - Admin's password
 * @returns A Promise resolving to the API response (usually containing a token)
 */
export const adminLogin = async (email: string, password: string) => {
  return apiFetch("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};
