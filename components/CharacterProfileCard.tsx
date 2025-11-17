import React from 'react';
import { CharacterProfile } from '../types';
import UserIcon from './icons/UserIcon';

interface CharacterProfileCardProps {
  character: CharacterProfile;
}

const CharacterProfileCard: React.FC<CharacterProfileCardProps> = ({ character }) => {
  return (
    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 shadow-lg transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20 relative overflow-hidden">
       <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <div className="flex items-start gap-3">
        <UserIcon className="w-7 h-7 text-indigo-400 mt-1 flex-shrink-0" />
        <div>
            <h3 className="text-xl font-bold text-indigo-300 mb-2">{character.name}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{character.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfileCard;