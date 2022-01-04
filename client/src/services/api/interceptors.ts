import sessionStorageService from "@services/sessionStorage/sessionStorageService";

const publicAccessRoutes = ["auth/signup", "auth/signin"];

export const addAuthToken = (req: Request): Request => {
  if (publicAccessRoutes.includes(req.url)) {
    return req;
  }

  const token = sessionStorageService.get("token");

  req.headers.set("Authorization", `Bearer ${token}`);

  return req;
};
