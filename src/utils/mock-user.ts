import { Roles } from "../utils/constants";

export const mockUsers = {
  TEACHER: {
    id: "al814zcy80074hloomogrg1mv",
    role: Roles.Teacher,
    name: "Teacher Migol",
    email: "migol@ceos.com",
    image: null,
  },
  STUDENT: {
    id: "bl814zcy80074hloomogrg1mv",
    role: Roles.Student,
    name: "Student Tubias",
    email: "tubias@ceos.com",
    image: null,
  },
  UNAUTHENTICATED: null,
};

export const getMockUser = (role: Roles) => {
  return mockUsers[role];
};
