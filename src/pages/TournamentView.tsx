import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrophyIcon, ArrowLeftIcon, TableIcon, ClipboardIcon } from 'lucide-react';
const TournamentView = ({
  tournamentData
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('standings');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [localTournamentData, setLocalTournamentData] = useState(tournamentData);
  useEffect(() => {
    // Redirect to creation page if no tournament data exists
    if (!tournamentData) {
      navigate('/');
      return;
    }
    // Find the next unplayed match
    const nextMatch = tournamentData.matches.find(match => !match.played);
    if (nextMatch) {
      setCurrentMatch(nextMatch);
    }
    setLocalTournamentData(tournamentData);
  }, [tournamentData, navigate]);
  if (!localTournamentData) {
    return null; // Will redirect in useEffect
  }
  const handleScoreChange = (teamIndex, newScore) => {
    if (newScore < 0) return;
    const updatedMatch = {
      ...currentMatch
    };
    updatedMatch.score[teamIndex] = parseInt(newScore, 10);
    setCurrentMatch(updatedMatch);
  };
  const handleMatchComplete = () => {
    // Update match as played
    const updatedMatch = {
      ...currentMatch,
      played: true
    };
    // Update team standings based on match result
    const team1 = updatedMatch.team1;
    const team2 = updatedMatch.team2;
    const score1 = updatedMatch.score[0];
    const score2 = updatedMatch.score[1];
    const updatedTeams = localTournamentData.teams.map(team => {
      if (team.id === team1.id) {
        const updatedTeam = {
          ...team,
          matchesPlayed: team.matchesPlayed + 1
        };
        if (score1 > score2) {
          updatedTeam.wins = team.wins + 1;
          updatedTeam.points = team.points + 3;
        } else if (score1 === score2) {
          updatedTeam.draws = team.draws + 1;
          updatedTeam.points = team.points + 1;
        } else {
          updatedTeam.losses = team.losses + 1;
        }
        return updatedTeam;
      }
      if (team.id === team2.id) {
        const updatedTeam = {
          ...team,
          matchesPlayed: team.matchesPlayed + 1
        };
        if (score2 > score1) {
          updatedTeam.wins = team.wins + 1;
          updatedTeam.points = team.points + 3;
        } else if (score1 === score2) {
          updatedTeam.draws = team.draws + 1;
          updatedTeam.points = team.points + 1;
        } else {
          updatedTeam.losses = team.losses + 1;
        }
        return updatedTeam;
      }
      return team;
    });
    // Update matches and find next unplayed match
    const updatedMatches = localTournamentData.matches.map(match => match.id === currentMatch.id ? updatedMatch : match);
    const nextMatch = updatedMatches.find(match => !match.played);
    // Update groups
    const updatedGroups = {};
    for (let i = 1; i <= localTournamentData.config.groupsCount; i++) {
      updatedGroups[i] = updatedTeams.filter(team => team.group === i).sort((a, b) => b.points - a.points || b.wins - a.wins);
    }
    // Update tournament data
    const updatedTournamentData = {
      ...localTournamentData,
      teams: updatedTeams,
      matches: updatedMatches,
      groups: updatedGroups
    };
    setLocalTournamentData(updatedTournamentData);
    setCurrentMatch(nextMatch);
  };
  const renderStandings = () => {
    if (localTournamentData.config.groupsCount === 1) {
      // Single group standings
      const sortedTeams = [...localTournamentData.teams].sort((a, b) => b.points - a.points || b.wins - a.wins);
      return <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Played
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  W
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  D
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  L
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTeams.map((team, index) => <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{team.name}</div>
                    <div className="text-xs text-gray-500">
                      {team.players.join(', ')}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {team.matchesPlayed}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {team.wins}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {team.draws}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {team.losses}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                    {team.points}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>;
    } else {
      // Multiple groups standings
      return <div className="space-y-8">
          {Object.entries(localTournamentData.groups).map(([groupNum, teams]) => <div key={groupNum} className="overflow-hidden bg-white shadow rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Group {groupNum}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Played
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          W
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          D
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          L
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teams.map((team, index) => <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-gray-500">
                              {team.players.join(', ')}
                            </div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {team.matchesPlayed}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {team.wins}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {team.draws}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-center text-gray-500">
                            {team.losses}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                            {team.points}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>)}
        </div>;
    }
  };
  const renderMatches = () => {
    // Group matches by status (current, upcoming, completed)
    const completedMatches = localTournamentData.matches.filter(match => match.played);
    const upcomingMatches = localTournamentData.matches.filter(match => !match.played);
    return <div className="space-y-8">
        {currentMatch && <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Current Match
              </h3>
              {localTournamentData.config.groupsCount > 1 && <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Group {currentMatch.group}
                </p>}
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0">
                <div className="flex flex-1 flex-col items-center">
                  <span className="text-lg font-medium">
                    {currentMatch.team1.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentMatch.team1.players.join(', ')}
                  </span>
                  <input type="number" min="0" value={currentMatch.score[0]} onChange={e => handleScoreChange(0, e.target.value)} className="mt-2 w-20 text-center border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" />
                </div>
                <div className="px-6 text-xl font-bold text-gray-500">VS</div>
                <div className="flex flex-1 flex-col items-center">
                  <span className="text-lg font-medium">
                    {currentMatch.team2.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentMatch.team2.players.join(', ')}
                  </span>
                  <input type="number" min="0" value={currentMatch.score[1]} onChange={e => handleScoreChange(1, e.target.value)} className="mt-2 w-20 text-center border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" />
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button onClick={handleMatchComplete} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Complete Match
                </button>
              </div>
            </div>
          </div>}
        {upcomingMatches.length > 0 && upcomingMatches[0] !== currentMatch && <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upcoming Matches
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {upcomingMatches.slice(currentMatch ? 1 : 0, 5).map(match => <li key={match.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {match.team1.name}
                      </div>
                      <span className="mx-2 text-gray-500">vs</span>
                      <div className="text-sm font-medium text-gray-900">
                        {match.team2.name}
                      </div>
                    </div>
                    {localTournamentData.config.groupsCount > 1 && <div className="text-sm text-gray-500">
                        Group {match.group}
                      </div>}
                  </div>
                </li>)}
            </ul>
          </div>}
        {completedMatches.length > 0 && <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Completed Matches
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {completedMatches.map(match => <li key={match.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-sm font-medium ${match.score[0] > match.score[1] ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                        {match.team1.name} ({match.score[0]})
                      </div>
                      <span className="mx-2 text-gray-500">-</span>
                      <div className={`text-sm font-medium ${match.score[1] > match.score[0] ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                        ({match.score[1]}) {match.team2.name}
                      </div>
                    </div>
                    {localTournamentData.config.groupsCount > 1 && <div className="text-sm text-gray-500">
                        Group {match.group}
                      </div>}
                  </div>
                </li>)}
            </ul>
          </div>}
      </div>;
  };
  return <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <TrophyIcon className="h-8 w-8 text-yellow-500 mr-2" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {localTournamentData.config.name || 'Tournament'}
            </h1>
            <p className="text-sm text-gray-500">
              {localTournamentData.teams.length} Teams •{' '}
              {localTournamentData.config.groupsCount} Groups
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Setup
        </button>
      </div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('standings')} className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'standings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <TableIcon className="mr-2 h-5 w-5 inline-block" />
              Standings
            </button>
            <button onClick={() => setActiveTab('matches')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'matches' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <ClipboardIcon className="mr-2 h-5 w-5 inline-block" />
              Matches
            </button>
          </nav>
        </div>
      </div>
      <div className="mt-6">
        {activeTab === 'standings' ? renderStandings() : renderMatches()}
      </div>
    </div>;
};
export default TournamentView;