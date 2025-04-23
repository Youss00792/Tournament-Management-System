import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateTournament from './pages/CreateTournament';
import TournamentView from './pages/TournamentView';
export function App() {
  const [tournamentData, setTournamentData] = useState(null);
  const handleTournamentCreate = data => {
    setTournamentData(data);
  };
  return <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<CreateTournament onTournamentCreate={handleTournamentCreate} />} />
          <Route path="/view" element={<TournamentView tournamentData={tournamentData} />} />
        </Routes>
      </div>
    </BrowserRouter>;
}