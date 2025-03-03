"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ActivityFeed } from "./activity-feed";
import { AdminSidebar } from "./admin-sidebar";
import { Globe3D } from "./globe/Globe3D";
import { Overview } from "./overview";
import { RecentSales } from "./recent-sales";

export default function AdminPanelPreview() {
	const [activeSection, setActiveSection] = useState("dashboard");

	return (
		<div className="flex h-full bg-background overflow-hidden">
			<AdminSidebar onSectionChange={setActiveSection} />
			<main className="flex-1 overflow-y-auto p-6 mb-6">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeSection}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="h-full"
					>
						{activeSection === "dashboard" && (
							<>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
									<Card className="col-span-3">
										<CardHeader>
											<CardTitle>Overview</CardTitle>
										</CardHeader>
										<CardContent>
											<Overview />
										</CardContent>
									</Card>
									<Card className="col-span-3">
										<CardHeader>
											<CardTitle>Recent Sales</CardTitle>
											<CardDescription>
												You made 265 sales this month.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<RecentSales />
										</CardContent>
									</Card>
									<Card className="col-span-3">
										<CardHeader>
											<CardTitle>Global Usage</CardTitle>
											<CardDescription>
												Where our customers are using the site.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Globe3D />
										</CardContent>
									</Card>
									<Card className="col-span-3">
										<CardHeader>
											<CardTitle>Activity Feed</CardTitle>
										</CardHeader>
										<CardContent>
											<ActivityFeed />
										</CardContent>
									</Card>
								</div>
							</>
						)}
						{activeSection === "users" && (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								<Card>
									<CardHeader>
										<CardTitle>User Management</CardTitle>
									</CardHeader>
									<CardContent>
										<p>User management features will appear here.</p>
									</CardContent>
								</Card>
							</div>
						)}
						{activeSection === "settings" && (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								<Card>
									<CardHeader>
										<CardTitle>Settings</CardTitle>
									</CardHeader>
									<CardContent>
										<p>Settings options will be displayed here.</p>
									</CardContent>
								</Card>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</main>
		</div>
	);
}
