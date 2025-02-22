"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const activities = [
  { id: 1, text: "John Doe logged in", time: "2 minutes ago" },
  { id: 2, text: "New order #1234 received", time: "10 minutes ago" },
  { id: 3, text: "Product X is low on stock", time: "1 hour ago" },
  { id: 4, text: "Monthly report generated", time: "3 hours ago" },
];

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-center space-x-4 p-2 rounded-lg bg-secondary"
        >
          <div className="bg-primary rounded-full p-2">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.text}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
