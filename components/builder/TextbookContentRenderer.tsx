import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

interface TextbookContentRendererProps {
  content: any[];
  onExtractText: (text: string) => void;
}

const ContentItem: React.FC<{ item: any; onExtractText: (text: string) => void }> = ({ item, onExtractText }) => {
  
  const getFullText = (contentItem: any): string => {
    if (typeof contentItem.content === 'string') return contentItem.content;
    if (typeof contentItem.text === 'string') return contentItem.text;
    if (Array.isArray(contentItem.content)) {
        return contentItem.content.map((chunk: any) => chunk.text || '').join('');
    }
    return '';
  };

  const handleExtract = () => {
      let textToExtract = getFullText(item);
      if (textToExtract) {
          onExtractText(textToExtract.trim());
      }
  };

  switch (item.type) {
    case 'unit-header':
      return (
        <div className="flex items-center gap-4 mb-4 pb-2 border-b-4 border-slate-800 dark:border-slate-300">
            <div className="w-20 h-16 flex-shrink-0">
                <svg viewBox="0 0 79 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                    d="M45.55,59.4C55.02,54.26,62,43.92,62,32C62,15.43,48.57,2,32,2C15.43,2,2,15.43,2,32C2,48.57,15.43,62,32,62C36.2,62,40.19,61.23,43.8,59.85V54H70C74.42,54,78,50.42,78,46C78,41.58,74.42,38,70,38H43.8V59.4Z"
                    className="fill-slate-500 dark:fill-slate-600"
                />
                <text x="32" y="35" textAnchor="middle" dominantBaseline="middle" className="fill-white text-[32px] font-bold">{item.unit}</text>
                <text x="60" y="46" textAnchor="middle" dominantBaseline="middle" className="fill-white text-[12px] font-bold tracking-wider">UNIT</text>
                </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{item.title}</h1>
        </div>
      );
      
    case 'heading':
      const Tag = `h${item.level || 1}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag className={`font-bold text-slate-900 dark:text-white ${item.level === 1 ? 'text-3xl mt-4 mb-3' : 'text-xl mt-3 mb-2'}`}>{item.text}</Tag>;
    
    case 'paragraph':
      return (
        <p className="relative group text-slate-700 dark:text-slate-300 text-justify">
          {Array.isArray(item.content) ? item.content.map((chunk, idx) => {
            if (chunk.type === 'bold') return <strong key={idx}>{chunk.text}</strong>;
            if (chunk.type === 'arabic') return <span key={idx} className="font-serif" dir="rtl"> {chunk.text} </span>;
            return <span key={idx}>{chunk.text}</span>;
          }) : item.text}
          <button onClick={handleExtract} className="absolute -right-3 -top-1 w-6 h-6 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" title="Add as custom question">
            <PlusCircleIcon />
          </button>
        </p>
      );
    
    case 'quote':
        return (
            <blockquote className="relative group my-2">
            <div className="pl-4 italic text-slate-600 dark:text-slate-400 text-justify">
                {Array.isArray(item.content) ? item.content.map((chunk, idx) => {
                    if (chunk.type === 'bold') return <strong key={idx}>{chunk.text}</strong>;
                    if (chunk.type === 'arabic') return <span key={idx} className="font-serif" dir="rtl"> {chunk.text} </span>;
                    return <span key={idx}>{chunk.text}</span>;
                }) : item.text}
            </div>
            <button onClick={handleExtract} className="absolute -right-3 -top-1 w-6 h-6 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" title="Add as custom question">
                <PlusCircleIcon />
            </button>
            </blockquote>
        );
    
    case 'paragraph-with-aside':
    return (
        <div className="my-1 flow-root">
            <div className="float-right w-1/3 max-w-xs ml-4 p-2 border border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-md text-xs">
                {item.aside.text}
            </div>
            <p className="relative group text-slate-700 dark:text-slate-300 text-justify">
                {Array.isArray(item.content) ? item.content.map((chunk, idx) => {
                    if (chunk.type === 'bold') return <strong key={idx}>{chunk.text}</strong>;
                    if (chunk.type === 'arabic') return <span key={idx} className="font-serif" dir="rtl"> {chunk.text} </span>;
                    return <span key={idx}>{chunk.text}</span>;
                }) : item.text}
                 <button onClick={handleExtract} className="absolute -right-3 -top-1 w-6 h-6 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" title="Add as custom question">
                    <PlusCircleIcon />
                </button>
            </p>
        </div>
    );

    case 'image':
      return (
        <div className="my-4 p-4 h-48 flex items-center justify-center bg-slate-100 dark:bg-slate-700/50 rounded-md shadow-sm border border-dashed border-slate-300 dark:border-slate-600">
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm italic">
            [Image: {item.alt || 'No description provided'}]
          </p>
        </div>
      );
      
    case 'box':
        const hasDarkHeader = item.headerStyle === 'dark';
        return (
            <div className={`my-4 rounded-lg border border-slate-300 dark:border-slate-600`}>
             {hasDarkHeader && (
                 <h4 className="font-bold text-white bg-slate-800 dark:bg-zinc-800 px-4 py-1">{item.title}</h4>
             )}
             <div className="p-4">
                {!hasDarkHeader && item.title && (
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.title}</h4>
                )}
                {item.content && (
                    <div className="text-slate-700 dark:text-slate-300">
                        {Array.isArray(item.content) ? 
                        item.content.map((chunk: any, idx: number) => {
                            if (chunk.type === 'bold') return <strong key={idx}>{chunk.text}</strong>;
                            if (chunk.type === 'arabic') return <span key={idx} className="font-serif" dir="rtl"> {chunk.text} </span>;
                            return <span key={idx}>{chunk.text}</span>;
                        }) : 
                        item.content
                        }
                    </div>
                )}
                {item.list && (
                    <ul className={`ml-4 list-disc text-slate-700 dark:text-slate-300 space-y-1`}>
                    {item.list.items.map((li: string, index: number) => <li key={index} dangerouslySetInnerHTML={{__html: li}}></li>)}
                    </ul>
                )}
             </div>
            </div>
      );

    case 'list':
      const ListTag = item.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`my-2 ml-6 ${item.ordered ? 'list-decimal' : 'list-disc'} text-slate-700 dark:text-slate-300 space-y-1`}>
          {item.items.map((li: string, index: number) => <li key={index}>{li}</li>)}
        </ListTag>
      );
      
    case 'arabic-quote':
        return (
            <div className="my-2 text-center">
                <p className="font-serif text-2xl text-slate-800 dark:text-slate-200" dir="rtl">{item.text}</p>
                <p className="text-sm italic text-slate-500 mt-1">"{item.translation}"</p>
            </div>
        );
    
    case 'glossary':
        return (
            <div className="my-4 border border-slate-400 dark:border-slate-500">
                <h4 className="font-bold text-lg text-white bg-slate-800 dark:bg-zinc-800 px-4 py-2">{item.title}</h4>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-200 dark:bg-zinc-700/50">
                            <th className="p-2 font-bold w-1/4 border-b border-slate-300 dark:border-slate-600">Words</th>
                            <th className="p-2 font-bold border-b border-slate-300 dark:border-slate-600">Meanings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.terms.map((term: any, index: number) => (
                            <tr key={index} className="border-b border-slate-200 dark:border-slate-700/50 last:border-b-0">
                                <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">{term.word}</td>
                                <td className="p-2 text-slate-700 dark:text-slate-300">{term.meaning}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    default:
      return <div className="my-2 p-2 bg-red-100 text-red-700">Unsupported content type: {item.type}</div>;
  }
};

const TextbookContentRenderer: React.FC<TextbookContentRendererProps> = ({ content, onExtractText }) => {
  return (
    <div className="text-[11pt] leading-[1.35]">
      {content.map((item, index) => (
        <ContentItem key={index} item={item} onExtractText={onExtractText} />
      ))}
    </div>
  );
};

export default TextbookContentRenderer;