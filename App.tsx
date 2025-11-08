import React, { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import ClassSelectionScreen from './components/screens/ClassSelectionScreen';
import SubjectSelectionScreen from './components/screens/SubjectSelectionScreen';
import PaperBuilderScreen from './components/screens/PaperBuilderScreen';
import { AppClass, AppSubject } from './types';

type Screen = 'class' | 'subject' | 'builder';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('class');
  const [selectedClass, setSelectedClass] = useState<AppClass | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<AppSubject | null>(null);
  const [downloadTextbookAction, setDownloadTextbookAction] = useState<(() => Promise<void>) | null>(null);

  const handleClassSelect = useCallback((appClass: AppClass) => {
    setSelectedClass(appClass);
    setScreen('subject');
  }, []);

  const handleSubjectSelect = useCallback((subject: AppSubject) => {
    setSelectedSubject(subject);
    setScreen('builder');
  }, []);

  const handleBackToClassSelection = useCallback(() => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setScreen('class');
  }, []);
  
  const handleBackToSubjectSelection = useCallback(() => {
    setSelectedSubject(null);
    setScreen('subject');
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'subject':
        if (selectedClass) {
          return <SubjectSelectionScreen selectedClass={selectedClass} onSubjectSelect={handleSubjectSelect} onBack={handleBackToClassSelection} />;
        }
        // Fallback to class selection if class is somehow not selected
        return <ClassSelectionScreen onClassSelect={handleClassSelect} />;
      case 'builder':
        if (selectedClass && selectedSubject) {
          return <PaperBuilderScreen 
                    selectedClass={selectedClass} 
                    selectedSubject={selectedSubject} 
                    onBack={handleBackToSubjectSelection} 
                    onSetDownloadAction={setDownloadTextbookAction}
                 />;
        }
        // Fallback
        return <ClassSelectionScreen onClassSelect={handleClassSelect} />;
      case 'class':
      default:
        return <ClassSelectionScreen onClassSelect={handleClassSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        onLogoClick={handleBackToClassSelection} 
        onDownloadTextbook={downloadTextbookAction}
      />
      <main className="container mx-auto px-4 py-8">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;