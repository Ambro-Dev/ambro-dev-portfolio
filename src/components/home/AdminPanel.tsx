// AdminPanel.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AdminPanel: React.FC = () => {
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(true);

  const toggleSidepanel = () => {
    setIsSidepanelOpen((prev) => !prev);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Użytkownicy" },
    { id: "settings", label: "Ustawienia" },
  ];

  return (
    <div className="w-full h-full flex bg-gray-50">
      {/* Sidebar */}
      <motion.div
        animate={{ x: isSidepanelOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <Card className="w-64 h-screen bg-gray-800 text-white p-4">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="ml-2 text-xl font-bold">Admin</span>
          </div>
          {/* Nawigacja z przyciskami */}
          <nav>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full text-left p-2 rounded transition-colors duration-200"
                  >
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>
        </Card>
      </motion.div>

      {/* Główna zawartość */}
      <div className="flex-1 p-6">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={toggleSidepanel}>
            {isSidepanelOpen ? "Ukryj menu" : "Pokaż menu"}
          </Button>
          <Button variant="default">Login</Button>
        </div>

        {/* Przykładowa zawartość dashboardu */}
        <Card className="p-6 shadow">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p>
            Witaj w panelu admina. Kliknij przyciski w menu, aby przejść do
            wybranej sekcji.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
