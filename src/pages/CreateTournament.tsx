import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TournamentForm from '../components/TournamentForm';
import TeamEntry from '../components/TeamEntry';
import { TrophyIcon } from 'lucide-react';
const CreateTournament = ({
  onTournamentCreate
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tournamentConfig, setTournamentConfig] = useState({
    name: '',
    teamsCount: 4,
    groupsCount: 1
  });
  const [teams, setTeams] = useState([]);
  const handleConfigSubmit = config => {
    setTournamentConfig(config);
    // Initialize empty teams based on count
    const initialTeams = Array(config.teamsCount).fill(null).map((_, index) => ({
      id: index + 1,
      name: `Team ${index + 1}`,
      players: ['', ''],
      points: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      group: Math.ceil((index + 1) / (config.teamsCount / config.groupsCount))
    }));
    setTeams(initialTeams);
    setStep(2);
  };
  const handleTeamsSubmit = updatedTeams => {
    // Create tournament data with teams and generate initial matches
    const groups = {};
    for (let i = 1; i <= tournamentConfig.groupsCount; i++) {
      groups[i] = updatedTeams.filter(team => team.group === i);
    }
    const matches = [];
    Object.values(groups).forEach(groupTeams => {
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          matches.push({
            id: matches.length + 1,
            team1: groupTeams[i],
            team2: groupTeams[j],
            played: false,
            score: [0, 0],
            group: groupTeams[i].group
          });
        }
      }
    });
    const tournamentData = {
      config: tournamentConfig,
      teams: updatedTeams,
      groups,
      matches,
      currentMatchIndex: 0
    };
    onTournamentCreate(tournamentData);
    navigate('/view');
  };
  return <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-center mb-8">
        <TrophyIcon className="h-8 w-8 text-yellow-500 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Tournament Manager</h1>
      </div>
      {step === 1 ? <TournamentForm initialConfig={tournamentConfig} onSubmit={handleConfigSubmit} /> : <TeamEntry teams={teams} setTeams={setTeams} onSubmit={handleTeamsSubmit} groupsCount={tournamentConfig.groupsCount} />}
    </div>;
};
export default CreateTournament;