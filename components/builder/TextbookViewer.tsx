import React, { useState, useEffect } from 'react';
import TextbookContentRenderer from './TextbookContentRenderer';
import PageFrame from './PageFrame';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

// Define types specific to the textbook structure
interface TextbookUnit {
    unit: number;
    title: string;
    startPage: number;
    endPage: number;
}

interface TextbookManifest {
    totalPages: number;
    units: TextbookUnit[];
}

interface TextbookViewerProps {
  classId: string;
  subjectId: string;
  onExtractText: (text: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TextbookViewer: React.FC<TextbookViewerProps> = ({ classId, subjectId, onExtractText, containerRef }) => {
    const [manifest, setManifest] = useState<TextbookManifest | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<TextbookUnit | null>(null);
    const [pagesContent, setPagesContent] = useState<any[][]>([]);
    const [loadingManifest, setLoadingManifest] = useState(true);
    const [loadingPages, setLoadingPages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const classNumber = classId.match(/\d+/)?.[0];

    // 1. Fetch the main textbook manifest to get units
    useEffect(() => {
        setManifest(null);
        setSelectedUnit(null);
        setPagesContent([]);
        setLoadingManifest(true);
        setError(null);

        fetch(`/data/${classId}/${subjectId}/textbook/manifest.json`)
            .then(res => {
                if (res.status === 404) return null; // No textbook is a valid case
                if (!res.ok) throw new Error(`Failed to fetch textbook manifest for ${classId}/${subjectId}`);
                return res.json();
            })
            .then((data: TextbookManifest | null) => {
                setManifest(data);
                if (data && data.units.length > 0) {
                    setSelectedUnit(data.units[0]);
                }
            })
            .catch(error => {
                console.error(error);
                setError("Could not load textbook data for this subject.");
            })
            .finally(() => setLoadingManifest(false));
    }, [classId, subjectId]);

    // 2. Fetch all pages for the selected unit
    useEffect(() => {
        if (!selectedUnit) {
            setPagesContent([]);
            return;
        }

        setLoadingPages(true);
        setError(null);
        const pagePromises = [];
        for (let i = selectedUnit.startPage; i <= selectedUnit.endPage; i++) {
            pagePromises.push(
                fetch(`/data/${classId}/${subjectId}/textbook/page${i}.json`)
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch page ${i}`);
                        return res.json();
                    })
            );
        }

        Promise.all(pagePromises)
            .then(pagesData => {
                const contents = pagesData.map(page => page.content || []);
                setPagesContent(contents);
            })
            .catch(err => {
                console.error("Failed to load textbook pages for unit", err);
                setError("Could not load pages for the selected unit.");
                setPagesContent([]);
            })
            .finally(() => setLoadingPages(false));

    }, [selectedUnit, classId, subjectId]);

    const renderContent = () => {
        if (loadingPages) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <ErrorMessage message="Error Loading Content" details={error} />;
        }
        if (pagesContent.length > 0) {
            return pagesContent.map((pageContent, index) => (
                <div key={index} className="relative w-full bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-700">
                     {/* Foolproof aspect-ratio container */}
                    <div className="relative w-full" style={{ paddingTop: '141.42%' /* A4 Aspect Ratio */ }}>
                        <div className="absolute inset-0">
                             {selectedUnit && (
                                <PageFrame 
                                    unitNumber={selectedUnit.unit}
                                    unitTitle={selectedUnit.title}
                                    classNumber={classNumber}
                                    pageNumber={selectedUnit.startPage + index}
                                />
                             )}
                            <main className="absolute inset-0 p-8 pt-20 pb-20">
                                <TextbookContentRenderer content={pageContent} onExtractText={onExtractText} />
                            </main>
                        </div>
                    </div>
                </div>
            ))
        }
        if (!loadingManifest && !manifest) {
             return <ErrorMessage message="No Textbook Available" details="Textbook content has not been added for this subject yet." />;
        }
        return <p className="text-zinc-500 text-center pt-10">Select a unit to view its content.</p>;
    }

    return (
        <div>
            {/* Unit Selection */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Textbook Units</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {loadingManifest ? <p className="text-sm text-zinc-500">Loading units...</p> : (
                        manifest && manifest.units.length > 0 ? manifest.units.map(unit => (
                            <button
                                key={unit.unit}
                                onClick={() => setSelectedUnit(unit)}
                                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                selectedUnit?.unit === unit.unit
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                            >
                                {`Unit ${unit.unit}: ${unit.title}`}
                            </button>
                        )) : <p className="text-sm text-zinc-500">No textbook content available for this subject.</p>
                    )}
                </div>
            </div>
            
            {/* Pages Area in a scrollable container */}
            <div ref={containerRef} className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
                {renderContent()}
            </div>
        </div>
    );
};

export default TextbookViewer;