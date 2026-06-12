import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const DocumentEditor = () => {
  const { matterId, docId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    document_type: '',
    parties: '',
    jurisdiction: '',
    notes: ''
  });

  useEffect(() => {
    if (docId) {
      fetchDocument();
    }
  }, [docId]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/documents/${docId}`);
      setDocument(res.data);
      setContent(res.data.content);
    } catch (err) {
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');
    try {
      const res = await API.post('/documents/generate', {
        matter_id: parseInt(matterId),
        ...formData
      });
      setDocument(res.data);
      setContent(res.data.content);
      setSuccess('Document generated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate document');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      await API.patch(`/documents/${document.id}`, { content });
      setSuccess('Document saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save document');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(`/matters/${matterId}`)}
        className="text-blue-700 hover:underline text-sm mb-4 block"
      >
        &larr; Back to Matter
      </button>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      {!document ? (
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Generate Document</h1>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Document Type</label>
              <select name="document_type" value={formData.document_type} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a document type</option>
                <option value="Demand Letter">Demand Letter</option>
                <option value="Non-Disclosure Agreement">Non-Disclosure Agreement</option>
                <option value="Cease and Desist Letter">Cease and Desist Letter</option>
                <option value="Retainer Agreement">Retainer Agreement</option>
                <option value="Settlement Agreement">Settlement Agreement</option>
                <option value="Contract">Contract</option>
                <option value="Motion">Motion</option>
                <option value="Legal Brief">Legal Brief</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parties Involved</label>
              <input type="text" name="parties" value={formData.parties} onChange={handleChange} required
                placeholder="e.g. John Smith (Plaintiff) vs. ABC Corp (Defendant)"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jurisdiction</label>
              <input type="text" name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} required
                placeholder="e.g. State of Michigan, Federal Court"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
                placeholder="Any specific details, clauses, or instructions for the document..."
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button
              type="submit"
              disabled={generating}
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
            >
              {generating ? 'Generating document with AI...' : 'Generate Document'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">{document.title}</h1>
              <p className="text-sm text-gray-500">{document.document_type} &mdash; {document.status}</p>
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
            >
              Save
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={30}
            className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;