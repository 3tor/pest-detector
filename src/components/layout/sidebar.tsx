'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, MessageSquare, Info } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname(); 
  const navSections = [
    {
      title: 'INSPECT',
      items: [
        { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', href: '/history', label: 'History', icon: History },
      ]
    },
    {
      title: 'LEARN',
      items: [
        { id: 'how-it-works', href: '/', label: 'How it works', icon: Info },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'feedback', href: '/feedback', label: 'Feedback', icon: MessageSquare },
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
                
                // Dynamically check if this link matches the current URL
                const isActive = pathname === item.href; 

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#2563EB] bg-blue-50/50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#2563EB]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-gray-400 group-hover:text-[#2563EB]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};