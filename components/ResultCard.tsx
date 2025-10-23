
import React from 'react';

interface ResultCardProps {
  text: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ text }) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');

  const renderLine = (line: string, index: number) => {
    if (line.startsWith('🥂')) {
      return <h2 key={index} className="text-xl font-bold text-center text-cyan-600 mb-4">{line}</h2>;
    }
    if (line.startsWith('---')) {
        return <hr key={index} className="my-4 border-gray-300"/>
    }
    if (line.startsWith('🍻')) {
      return <p key={index} className="text-lg font-semibold text-gray-800">{line.replace('🍻', '').trim()}</p>;
    }
    if (line.startsWith('**【')) {
        return <h3 key={index} className="text-md font-bold text-gray-700 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
    }
    if (line.startsWith('###')) {
        return <h3 key={index} className="text-2xl font-extrabold text-center text-cyan-700 my-3">{line.replace('###','').trim()}</h3>;
    }
     if (line.startsWith('（例：')) {
        return <p key={index} className="text-sm text-center text-gray-500 mb-4">{line}</p>;
    }
    if (line.startsWith('- ')) {
      return <li key={index} className="text-gray-600 ml-5 list-disc">{line.substring(2)}</li>;
    }
    return <p key={index} className="text-gray-600">{line}</p>;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border-2 border-cyan-500 shadow-lg animate-fade-in-up">
      {lines.map(renderLine)}
    </div>
  );
};

export default ResultCard;
