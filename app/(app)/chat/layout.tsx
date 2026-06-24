import ChatLayout from "@/app/components/chat/ChatLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatLayout>{children}</ChatLayout>;
}
