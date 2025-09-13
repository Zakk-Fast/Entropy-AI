import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ChatContainer from "@/components/chat/ChatContainer";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatContainer />
      </div>
    </div>
  );
}
