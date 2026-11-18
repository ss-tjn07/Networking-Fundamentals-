import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TopicDrawer from './components/TopicDrawer';
import PresenterNotes from './components/PresenterNotes';
import QuizModal from './components/QuizModal';
import PracticalsModal from './components/PracticalsModal';
import FooterBar from './components/FooterBar';

import IntroTopic from './components/topics/IntroTopic';
import HardwareTopic from './components/topics/HardwareTopic';
import MediaTopic from './components/topics/MediaTopic';
import ScopeTopic from './components/topics/ScopeTopic';
import TopologiesTopic from './components/topics/TopologiesTopic';
import OsiTcpTopic from './components/topics/OsiTcpTopic';
import Ipv4Ipv6Topic from './components/topics/Ipv4Ipv6Topic';
import DhcpDoraTopic from './components/topics/DhcpDoraTopic';
import ClassesTopic from './components/topics/ClassesTopic';
import PortsProtocolsTopic from './components/topics/PortsProtocolsTopic';
import WindowsFundamentalsTopic from './components/topics/WindowsFundamentalsTopic';
import WindowsServerTopic from './components/topics/WindowsServerTopic';
import LinuxFundamentalsTopic from './components/topics/LinuxFundamentalsTopic';
import LinuxAdminTopic from './components/topics/LinuxAdminTopic';

import { topics } from './data/topicsData';
import { topicQuizzes } from './data/quizzesData';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [presenterNotesOpen, setPresenterNotesOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [practicalsOpen, setPracticalsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Click nodes or adjust controls to test packet flows.");

  const currentTopic = topics[currentTopicIndex];
  const currentQuiz = topicQuizzes[currentTopicIndex];

  const handlePrevSlide = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        setDrawerOpen(false);
        setQuizModalOpen(false);
        setPracticalsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTopicIndex]);

  const renderCurrentTopicContent = () => {
    switch (currentTopic.id) {
      case 'intro':
        return <IntroTopic setStatusMessage={setStatusMessage} />;
      case 'hardware':
        return <HardwareTopic setStatusMessage={setStatusMessage} />;
      case 'media':
        return <MediaTopic />;
      case 'scope':
        return <ScopeTopic />;
      case 'topologies':
        return <TopologiesTopic />;
      case 'osi-tcpip':
        return <OsiTcpTopic />;
      case 'ipv4-ipv6':
        return <Ipv4Ipv6Topic />;
      case 'dhcp-dora':
        return <DhcpDoraTopic />;
      case 'classes':
        return <ClassesTopic />;
      case 'ports-protocols':
        return <PortsProtocolsTopic setStatusMessage={setStatusMessage} />;
      case 'windows-fundamentals':
        return <WindowsFundamentalsTopic />;
      case 'windows-server':
        return <WindowsServerTopic />;
      case 'linux-fundamentals':
        return <LinuxFundamentalsTopic />;
      case 'linux-admin':
        return <LinuxAdminTopic />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-black ${presentationMode ? 'presentation-active' : ''}`}>
      {/* Top App Bar */}
      <Header
        presentationMode={presentationMode}
        setPresentationMode={setPresentationMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        onOpenPracticals={() => setPracticalsOpen(true)}
        currentTopicIndex={currentTopicIndex}
        topicsCount={topics.length}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        setStatusMessage={setStatusMessage}
      />

      {/* Curriculum Syllabus Drawer */}
      <TopicDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        topics={topics}
        currentTopicIndex={currentTopicIndex}
        onOpenPracticals={() => setPracticalsOpen(true)}
        onSelectTopic={(idx) => {
          setCurrentTopicIndex(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 md:p-6 space-y-6">
        {/* Topic Sub-header / Progress Tracker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {currentTopic.badge}
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-white">
                {currentTopic.title}
              </h2>
              <p className="text-xs text-slate-400">
                {currentTopic.subtitle}
              </p>
            </div>
          </div>

          {/* Quick presenter notes toggle & Quiz button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPresenterNotesOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-purple-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Teacher Explainer</span>
            </button>
            <button
              onClick={() => setQuizModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 rounded-lg text-xs text-cyan-300 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Check Understanding</span>
            </button>
          </div>
        </div>

        {/* Collapsible Teacher Explainer Banner */}
        <PresenterNotes
          isOpen={presenterNotesOpen}
          notes={currentTopic.notes}
        />

        {/* Dynamic Section Viewport */}
        <div className="min-h-[560px] flex flex-col justify-start">
          {renderCurrentTopicContent()}
        </div>

        {/* Classroom Interactive Bottom Bar */}
        <FooterBar
          statusMessage={statusMessage}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          currentTopicIndex={currentTopicIndex}
          topicsCount={topics.length}
        />
      </main>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        quizData={currentQuiz}
      />

      {/* TryHackMe Practicals & Assignments Modal */}
      <PracticalsModal
        isOpen={practicalsOpen}
        onClose={() => setPracticalsOpen(false)}
        onSelectTopic={(idx) => {
          setCurrentTopicIndex(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

