'use client';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-black/70 text-white py-2 sm:py-4 px-4 sm:px-6 backdrop-blur-sm shadow-inner">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-1 sm:gap-3">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-white">FootBase</span>. Tous droits réservés.
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://www.facebook.com/tonprofil"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
            aria-label="Facebook"
          >
            <FaFacebookF size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/tonprofil"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}


