import { useState } from "react";
import { LogOut, User, Mail, Menu, X } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Logo size="md" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Vocali
            </h1>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop header content */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">
                Voice recognition ready
              </span>
            </div>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors  focus:outline-none"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-4">
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">
                Voice recognition ready
              </span>
            </div>

            {user && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors w-full p-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
