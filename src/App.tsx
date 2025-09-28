import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import ChatHistory from "@/pages/ChatHistory";
import StrategicConsultantChat from "@/pages/StrategicConsultantChat";
import HRConsultantChat from "@/pages/HRConsultantChat";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat-history" element={<ChatHistory />} />
        <Route path="/strategic-consultant" element={<StrategicConsultantChat />} />
        <Route path="/hr-consultant" element={<HRConsultantChat />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
