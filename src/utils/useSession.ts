/* eslint-disable react-hooks/rules-of-hooks */
import { useSession as useNextAuthSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Roles } from "./constants";
import { getMockUser } from "./mock-user";

export const useSession = () => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    const [mockRole, setMockRole] = useState();

    useEffect(() => {
      fetch("/api/mock-role")
        .then((response) => response.json())
        .then(({ role }) => {
          setMockRole(role);
        });
    }, []);

    if (!mockRole) {
      return {
        data: undefined,
        status: "loading",
      };
    } else {
      return {
        data:
          mockRole === Roles.Unauthenticated
            ? null
            : {
                user: getMockUser(mockRole),
              },
        status:
          mockRole === Roles.Unauthenticated
            ? "unauthenticated"
            : "authenticated",
      };
    }
  } else {
    return useNextAuthSession();
  }
};
