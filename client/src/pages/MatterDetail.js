import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const MatterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matter, setMatter] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchMatter();
    fetchDocuments();
  }, [id]);

  const fetchMatter = async () => {
    try {
      const res = await API.get(`/matters/${id}`);
      setMatter(res.data);
      setFormData(res.data);
    } catch (err) {
      setError('Failed to load matter');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await API.get(`/documents/matter/${id}`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to load documents');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.patch(`/matters/${id}`, formData);
      setMatter(res.data);
      setEditing(false);
    } catch (err) {
      setError('Failed to update matter');
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await API.delete(`/documents/${docId}`);
      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!matter) return <div className="p-8 text-center text-red-500">Matter not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/matters')} className="text-blue-700 hover:underline text-sm mb-4 block">
        &larr; Back to Matters
      </button>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white p-6 rounded shadow mb-6">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-900">Edit Matter</h2>
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
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-blue-900">{matter.title}</h1>
                <p className="text-gray-600 mt-1">{matter.client_name} &mdash; {matter.matter_type}</p>
                <p className="text-gray-500 text-sm">{matter.jurisdiction}</p>
                {matter.description && <p className="text-gray-600 mt-3">{matter.description}</p>}
                <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full font-medium ${
                  matter.status === 'Active' ? 'bg-green-100 text-green-700' :
                  matter.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {matter.status}
                </span>
              </div>
              <button onClick={() => setEditing(true)} className="text-blue-700 hover:underline text-sm">Edit</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">Documents</h2>
        <button
          onClick={() => navigate(`/matters/${id}/documents/new`)}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
        >
          + Generate Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No documents yet. Click "Generate Document" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div className="cursor-pointer flex-1" onClick={() => navigate(`/documents/${doc.id}`)}>
                <h3 className="font-semibold text-blue-900">{doc.title}</h3>
                <p className="text-sm text-gray-500">{doc.document_type} &mdash; {doc.status}</p>
                <p className="text-xs text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDeleteDocument(doc.id)}
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

export default MatterDetail;