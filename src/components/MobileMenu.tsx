"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-green-600"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-green-100 shadow-lg z-40">
          <div className="px-4 py-4 space-y-4">
            <a 
              href="#features" 
              className="block text-gray-600 hover:text-green-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block text-gray-600 hover:text-green-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </a>
            <a 
              href="#testimonials" 
              className="block text-gray-600 hover:text-green-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Reviews
            </a>
            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
