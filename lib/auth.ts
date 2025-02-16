export type User = {
  id: string;
  name: string;
  email: string;
  role: "professor" | "student";
};

const USERS: User[] = [
  // Professors
  {
    id: "db35e87e-a114-4bbb-8c25-4cfe54b9b5c0",
    name: "Josipa Baric",
    email: "josipa.baric@example.com",
    role: "professor",
  },
  {
    id: "01cb5a40-c317-4c52-a918-111a0a276058",
    name: "Dajana Dujic",
    email: "dajana.dujic@example.com",
    role: "professor",
  },
  {
    id: "05563107-83cc-4830-9589-e8c039c76953",
    name: "Damir Lelas",
    email: "damir.lelas@example.com",
    role: "professor",
  },
  {
    id: "120a1ffa-c254-471e-84b7-b4f5af6666a1",
    name: "Duje Giljanovic",
    email: "duje.giljanovic@example.com",
    role: "professor",
  },
  {
    id: "b8be955a-f94b-4f71-8cc2-dde9c468fce5",
    name: "Mirjana Bonkovic",
    email: "mirjana.bonkovic@example.com",
    role: "professor",
  },
  // Students
  {
    id: "e99713e7-3ab8-43e3-baa0-e6578f414ac8",
    name: "Ivan Horvat",
    email: "ivan.horvat@example.com",
    role: "student",
  },
  {
    id: "8bb1ef6b-21a5-4e2c-a9a9-a81fa478fcbf",
    name: "Ana Kovac",
    email: "ana.kovac@example.com",
    role: "student",
  },
  {
    id: "cff0a080-809e-46cf-9671-e0e89d51fb6a",
    name: "Marko Maric",
    email: "marko.maric@example.com",
    role: "student",
  },
  {
    id: "4b02d233-2d12-4ce3-84f2-ad112aa4755b",
    name: "Petra Novak",
    email: "petra.novak@example.com",
    role: "student",
  },
  {
    id: "cc1f16aa-9a76-4fb3-9776-371c321cdda5",
    name: "Lucija Juric",
    email: "lucija.juric@example.com",
    role: "student",
  },
  {
    id: "6ef8c3d1-2057-404c-a9f7-0da71840bd18",
    name: "Stjepan Bosnjak",
    email: "stjepan.bosnjak@example.com",
    role: "student",
  },
  {
    id: "6efe9494-674f-451a-9f2e-4c9b87ef2cf5",
    name: "Marija Saric",
    email: "marija.saric@example.com",
    role: "student",
  },
  {
    id: "5949cbae-2ae9-4cc0-9195-c8d7b983fa91",
    name: "Nikola Mikic",
    email: "nikola.mikic@example.com",
    role: "student",
  },
  {
    id: "dddff864-0c98-491a-8716-ea8bf66ae97b",
    name: "Ivana Babic",
    email: "ivana.babic@example.com",
    role: "student",
  },
  {
    id: "df8735ec-838b-4b61-a6e5-c1223c7ae170",
    name: "Matej Vidovic",
    email: "matej.vidovic@example.com",
    role: "student",
  },
];

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function authenticate(email: string, password: string): User | null {
  const user = USERS.find((user) => user.email === email);
  if (!user) return null;

  if (user.role === "professor" && password === "prof123") {
    setCookie("authenticatedUserName", user.name, 1);
    setCookie("authenticatedUserId", user.id, 1);
    return user;
  }
  if (user.role === "student" && password === "stud123") {
    setCookie("authenticatedUserName", user.name, 1);
    setCookie("authenticatedUserId", user.id, 1);
    return user;
  }
  return null;
}