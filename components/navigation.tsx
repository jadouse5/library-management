"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Book, Disc, Home, History } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Books", href: "/books", icon: Book },
  { name: "DVDs", href: "/dvds", icon: Disc },
  { name: "History", href: "/history", icon: History },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">OOP Library</h1>
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}