import { ProfilePageClient } from "./_components/ProfilePageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필",
  description: "프로필 페이지",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
