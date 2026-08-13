import React from 'react';
import { MoreVertical } from 'lucide-react';

const TreatmentCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col min-h-[160px] shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="w-5 h-1 bg-[#2563EB] rounded-full mb-3"></div>
      
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export const ScanBreakdownGrid = ({ breakdown }: { breakdown: any }) => {
  if (!breakdown) return null;

  return (
    <section className="mt-6 space-y-4">
      <h3 className="text-base font-bold text-gray-900">Treatment & Management Plan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TreatmentCard 
          title={breakdown.immediate_action.title} 
          description={breakdown.immediate_action.description} 
        />
        <TreatmentCard 
          title={breakdown.organic_treatment.title} 
          description={breakdown.organic_treatment.description} 
        />
        <TreatmentCard 
          title={breakdown.chemical_treatment.title} 
          description={breakdown.chemical_treatment.description} 
        />
        <TreatmentCard 
          title={breakdown.prevention.title} 
          description={breakdown.prevention.description} 
        />
      </div>
    </section>
  );
};