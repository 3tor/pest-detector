import React from 'react';
import { LayoutDashboard, History, HelpCircle, BookOpen, MessageSquare, Info } from 'lucide-react';

export const Sidebar = () => {
  const navSections = [
    {
      title: 'INSPECT',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
        { id: 'history', label: 'History', icon: History, active: false },
      ]
    },
    {
      title: 'LEARN',
      items: [
        { id: 'how-it-works', label: 'How works', icon: Info, active: false },
        { id: 'watermarks-guide', label: 'Watermarks guide', icon: BookOpen, active: false },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'help', label: 'Help & docs', icon: HelpCircle, active: false },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, active: false },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-[#1D2939] flex items-center gap-1">
          <span className="text-[#2563EB]">Pest</span> Detector
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-400 tracking-wider uppercase">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'text-[#2563EB] bg-blue-50/50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.active ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};