import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PatientProfile from "@/app/components/profile/PatientProfile";
import TherapistProfile from "@/app/components/profile/TherapistProfile";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  if (session.user.role === "therapist") {
    return <TherapistProfile user={session.user} />;
  }

  return <PatientProfile user={session.user} />;
}
