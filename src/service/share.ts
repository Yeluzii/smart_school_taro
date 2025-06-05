import { http } from "@/utils/http";

export const getShares = () => {
  return http<ShareType[]>({
    method: "GET",
    url: "/content/shares",
  });
};
