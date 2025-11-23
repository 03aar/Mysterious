import React from 'react';
import { LocationData } from '../types';
import { ArrowPathIcon, MapPinIcon, SparklesIcon, ShieldExclamationIcon, EyeIcon } from '@heroicons/react/24/outline';

interface LocationCardProps {
  data: LocationData;
  imageUrl: string | null;
  onGenerateNew: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ data, imageUrl, onGenerateNew }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up pb-20">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 mb-4 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <MapPinIcon className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-200 text-sm font-medium tracking-wider uppercase">Location Discovered</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 drop-shadow-lg mb-2">
          {data.name}
        </h2>
        <p className="text-slate-400 text-lg italic">{data.shortDescription}</p>
      </div>

      {/* Image & Primary Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Image Section */}
        <div className="lg:col-span-2 relative group overflow-hidden rounded-xl border border-slate-700 shadow-2xl bg-slate-900">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={data.name} 
              className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-80 lg:h-96 bg-slate-800 flex items-center justify-center flex-col p-6 text-slate-500">
               <EyeIcon className="w-12 h-12 mb-2 opacity-50" />
               <span className="text-sm uppercase tracking-widest">Visual Manifestation Unavailable</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-6">
             <span className="inline-block px-3 py-1 rounded text-xs font-bold tracking-wider bg-black/50 border border-slate-600 text-slate-300 backdrop-blur-sm">
               VISUAL RECORD
             </span>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
           <div>
             <h3 className="text-indigo-300 font-display text-xl mb-4 border-b border-indigo-500/20 pb-2">Threat Assessment</h3>
             <div className="flex items-center mb-6">
                <ShieldExclamationIcon className={`w-8 h-8 mr-3 ${
                    data.dangerLevel === 'Extreme' ? 'text-red-500' :
                    data.dangerLevel === 'High' ? 'text-orange-500' :
                    data.dangerLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                }`} />
                <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Danger Level</div>
                    <div className={`font-bold text-lg ${
                        data.dangerLevel === 'Extreme' ? 'text-red-400' :
                        data.dangerLevel === 'High' ? 'text-orange-300' :
                        data.dangerLevel === 'Medium' ? 'text-yellow-200' : 'text-green-300'
                    }`}>{data.dangerLevel}</div>
                </div>
             </div>

             <h3 className="text-indigo-300 font-display text-xl mb-4 border-b border-indigo-500/20 pb-2">Sensory Data</h3>
             <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start">
                    <span className="text-indigo-400 w-6 mr-2">🔊</span> 
                    <span>{data.sensoryDetails.sound}</span>
                </li>
                <li className="flex items-start">
                    <span className="text-indigo-400 w-6 mr-2">👃</span> 
                    <span>{data.sensoryDetails.smell}</span>
                </li>
                <li className="flex items-start">
                    <span className="text-indigo-400 w-6 mr-2">💡</span> 
                    <span>{data.sensoryDetails.lighting}</span>
                </li>
             </ul>
           </div>
        </div>
      </div>

      {/* Lore & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lore */}
        <div className="glass-panel rounded-xl p-6">
            <h3 className="text-2xl font-display text-amber-200 mb-4 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2" />
                Archive Lore
            </h3>
            <p className="text-slate-300 leading-relaxed border-l-2 border-amber-500/30 pl-4">
                {data.lore}
            </p>
        </div>

        {/* Secrets & Loot */}
        <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6 bg-indigo-900/10">
                <h3 className="text-xl font-display text-indigo-300 mb-3">Hidden Secrets</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                    {data.hiddenSecrets.map((secret, idx) => (
                        <li key={idx} className="marker:text-indigo-500">{secret}</li>
                    ))}
                </ul>
            </div>
            <div className="glass-panel rounded-xl p-6 bg-emerald-900/10">
                <h3 className="text-xl font-display text-emerald-300 mb-3">Potential Loot</h3>
                <div className="flex flex-wrap gap-2">
                    {data.potentialLoot.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded text-emerald-200 text-sm">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* Floating Action Button for Mobile/Quick Access */}
      <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={onGenerateNew}
            className="flex items-center justify-center w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            title="Discover New Location"
          >
              <ArrowPathIcon className="w-8 h-8" />
          </button>
      </div>
    </div>
  );
};

export default LocationCard;