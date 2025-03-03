"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { useState } from "react";

const navItems = [
	{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ id: "users", label: "Users", icon: Users },
	{ id: "settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
	onSectionChange,
}: {
	onSectionChange: (section: string) => void;
}) {
	const [activeItem, setActiveItem] = useState("dashboard");

	const handleItemClick = (id: string) => {
		setActiveItem(id);
		onSectionChange(id);
	};

	return (
		<div className="w-64 h-full bg-background border-r border-border flex flex-col">
			<div className="p-4 border-b border-border">
				<div className="flex items-center space-x-2">
					<Avatar>
						<AvatarImage src="/logo.png" alt="Admin Logo" />
						<AvatarFallback>AD</AvatarFallback>
					</Avatar>
					<span className="text-lg font-bold">Admin Panel</span>
				</div>
			</div>
			<nav className="flex-1 p-4">
				{navItems.map((item) => (
					<Button
						key={item.id}
						variant={activeItem === item.id ? "secondary" : "ghost"}
						className="w-full justify-start mb-2"
						onClick={() => handleItemClick(item.id)}
					>
						<item.icon className="mr-2 h-4 w-4" />
						{item.label}
					</Button>
				))}
			</nav>
		</div>
	);
}
