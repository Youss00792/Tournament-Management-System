import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
const EditTeamModal = ({
  team,
  onSave,
  onClose,
  groupsCount
}) => {
  const [formData, setFormData] = useState({
    ...team
  });
  useEffect(() => {
    // Add event listener to close modal on escape key
    const handleEsc = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[index] = value;
    setFormData({
      ...formData,
      players: updatedPlayers
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };
  // Prevent click propagation from modal content to overlay
  const handleModalContentClick = e => {
    e.stopPropagation();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md" onClick={handleModalContentClick}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Edit Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500" aria-label="Close">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="team-name">
              Team Name
            </label>
            <input id="team-name" name="name" type="text" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Players
            </label>
            <div className="space-y-2">
              {formData.players.map((player, index) => <input key={index} type="text" value={player} onChange={e => handlePlayerChange(index, e.target.value)} placeholder={`Player ${index + 1}`} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5" required />)}
            </div>
          </div>
          {groupsCount > 1 && <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="group">
                Group
              </label>
              <select id="group" name="group" value={formData.group} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5">
                {Array.from({
              length: groupsCount
            }, (_, i) => i + 1).map(num => <option key={num} value={num}>
                    Group {num}
                  </option>)}
              </select>
            </div>}
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default EditTeamModal;