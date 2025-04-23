import React, { useState } from 'react';
import { UserIcon, UsersIcon, PencilIcon, SaveIcon } from 'lucide-react';
import EditTeamModal from './EditTeamModal';
const TeamEntry = ({
  teams,
  setTeams,
  onSubmit,
  groupsCount
}) => {
  const [editingTeam, setEditingTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditClick = team => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };
  const handleTeamUpdate = updatedTeam => {
    setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
    setIsModalOpen(false);
  };
  const handleSubmit = () => {
    // Validate all teams have names
    const isValid = teams.every(team => team.name.trim() !== '' && team.players.every(player => player.trim() !== ''));
    if (isValid) {
      onSubmit(teams);
    } else {
      alert('Please fill in all team and player names');
    }
  };
  // Group teams by their assigned group
  const teamsByGroup = {};
  for (let i = 1; i <= groupsCount; i++) {
    teamsByGroup[i] = teams.filter(team => team.group === i);
  }
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Enter Team Information
      </h2>
      {groupsCount > 1 && <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Tournament Groups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(teamsByGroup).map(([groupNum, groupTeams]) => <div key={groupNum} className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Group {groupNum}
                </h4>
                <ul className="text-sm text-gray-600">
                  {groupTeams.map(team => <li key={team.id} className="mb-1">
                      • {team.name}
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Team Details</h3>
        <div className="space-y-4">
          {teams.map(team => <div key={team.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-gray-800">{team.name}</span>
                </div>
                <button onClick={() => handleEditClick(team)} className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Edit team">
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {team.players.map((player, idx) => <div key={idx} className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{player || `Player ${idx + 1}`}</span>
                  </div>)}
              </div>
              {groupsCount > 1 && <div className="mt-2 text-xs text-gray-500">
                  Group {team.group}
                </div>}
            </div>)}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-sm flex items-center transition duration-150 ease-in-out">
          <SaveIcon className="h-5 w-5 mr-2" />
          Save and View Tournament
        </button>
      </div>
      {isModalOpen && editingTeam && <EditTeamModal team={editingTeam} onSave={handleTeamUpdate} onClose={() => setIsModalOpen(false)} groupsCount={groupsCount} />}
    </div>;
};
export default TeamEntry;