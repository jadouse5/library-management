import { Heart } from "lucide-react";
import React from "react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center text-sm text-muted-foreground">
          <p className="flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for Object Oriented Programming
          </p>
          <p>
            Al Akhawayn University - Spring 2024
          </p>
          <p>
            Author: Jad Tounsi El Azzoiani
          </p>
          <p>
            Course taught by Dr. Oumaima Hourrane
          </p>
        </div>
      </div>
    </footer>
  );
}
