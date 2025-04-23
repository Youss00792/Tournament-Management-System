import React, { useState } from 'react';
import { TrophyIcon, UsersIcon, LayersIcon } from 'lucide-react';
const TournamentForm = ({
  initialConfig,
  onSubmit
}) => {
  const [formData, setFormData] = useState(initialConfig);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    let parsedValue = value;
    if (name === 'teamsCount' || name === 'groupsCount') {
      parsedValue = parseInt(value, 10);
    }
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tournament name is required';
    }
    if (formData.teamsCount < 2) {
      newErrors.teamsCount = 'At least 2 teams are required';
    }
    if (formData.teamsCount % formData.groupsCount !== 0) {
      newErrors.groupsCount = 'Teams must be evenly divisible by groups';
    }
    if (formData.groupsCount < 1) {
      newErrors.groupsCount = 'At least 1 group is required';
    }
    if (formData.groupsCount > formData.teamsCount) {
      newErrors.groupsCount = 'Cannot have more groups than teams';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Create New Tournament
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
            Tournament Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrophyIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5" placeholder="Enter tournament name" />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="teamsCount">
              Number of Teams
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UsersIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="teamsCount" name="teamsCount" type="number" min="2" value={formData.teamsCount} onChange={handleChange} className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5" />
            </div>
            {errors.teamsCount && <p className="mt-1 text-sm text-red-600">{errors.teamsCount}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="groupsCount">
              Number of Groups
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LayersIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="groupsCount" name="groupsCount" type="number" min="1" max={formData.teamsCount} value={formData.groupsCount} onChange={handleChange} className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5" />
            </div>
            {errors.groupsCount && <p className="mt-1 text-sm text-red-600">{errors.groupsCount}</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out">
            Continue to Team Entry
          </button>
        </div>
      </form>
    </div>;
};
export default TournamentForm;