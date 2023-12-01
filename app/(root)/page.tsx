import getCurrentUser from "@/actions/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  return <h1>Hi {user?.name}</h1>;
}
