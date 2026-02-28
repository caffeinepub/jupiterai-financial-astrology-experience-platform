import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 backdrop-blur-md bg-background/80 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline w-4 h-4 text-cosmic-pink fill-cosmic-pink" /> using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cosmic-purple hover:text-cosmic-turquoise transition-colors font-medium"
          >
            caffeine.ai
          </a>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2">
          For entertainment purposes only. Not financial advice.
        </div>
      </div>
    </footer>
  );
}
