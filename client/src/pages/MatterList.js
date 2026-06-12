import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const MatterList = () => {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    matter_type: '',
    jurisdiction: '',
    description: '',
    status: 'Active'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatters();
  }, []);

  const fetchMatters = async () => {
    try {
      const res = await API.get('/matters/');
      setMatters(res.data);
    } catch (err) {
      setError('Failed to load matters');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/matters/', formData);
      setFormData({ title: '', client_name: '', matter_type: '', jurisdiction: '', description: '', status: 'Active' });
      setShowForm(false);
      fetchMatters();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create matter');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this matter?')) return;
    try {
      await API.delete(`/matters/${id}`);
      fetchMatters();
    } catch (err) {
      setError('Failed to delete matter');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading matters...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">My Matters</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          {showForm ? 'Cancel' : '+ New Matter'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-900">Create New Matter</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Matter Type</label>
              <input type="text" name="matter_type" value={formData.matter_type} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jurisdiction</label>
              <input type="text" name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
            Create Matter
          </button>
        </form>
      )}

      {matters.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No matters yet.</p>
          <p className="text-sm">Click "New Matter" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matters.map((matter) => (
            <div key={matter.id} className="bg-white p-5 rounded shadow flex justify-between items-start">
              <div className="cursor-pointer flex-1" onClick={() => navigate(`/matters/${matter.id}`)}>
                <h3 className="text-lg font-semibold text-blue-900">{matter.title}</h3>
                <p className="text-sm text-gray-600">{matter.client_name} &mdash; {matter.matter_type}</p>
                <p className="text-sm text-gray-500">{matter.jurisdiction}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                  matter.status === 'Active' ? 'bg-green-100 text-green-700' :
                  matter.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {matter.status}
                </span>
              </div>
              <button
                onClick={() => handleDelete(matter.id)}
                className="text-red-500 hover:text-red-700 text-sm ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatterList;