import { Roles } from "@utils/constants";

const becomeRole = (role: string) => {
  fetch("/api/mock-role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role,
    }),
  }).then(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    location.reload();
  });
};

export const ChangeRoleFooter = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH && (
        <div className="bg-red-200">
          <div className="container flex gap-2 items-center mx-auto text-black">
            DEVELOPMENT ROLE SWITCHER:
            <button
              onClick={() => {
                becomeRole(Roles.Student);
              }}
            >
              student
            </button>
            <button
              onClick={() => {
                becomeRole(Roles.Teacher);
              }}
            >
              teacher
            </button>
            <button
              onClick={() => {
                becomeRole("UNAUTHENTICATED");
              }}
            >
              unauthenticated
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default ChangeRoleFooter;
