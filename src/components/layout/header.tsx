import React from 'react';
import { Plus, User } from 'lucide-react';

interface HeaderProps {
  onNewScan: () => void;
}

export const Header = ({ onNewScan }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
      <div className="text-sm font-medium text-gray-500">
        AI-powered pest detection analysis
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewScan}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-shadow shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New scan</span>
        </button>
        <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};