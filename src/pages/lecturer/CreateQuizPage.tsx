import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/api/axios.config';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';

interface Question {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  marks: number;
}

const CreateQuizPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    moduleId: moduleId || '',
  });

  const [questions, setQuestions] = useState<Question[]>([
    { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', marks: 1 }
  ]);

  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', marks: 1 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizData.title) return toast.error('Please enter quiz title');
    
    setLoading(true);
    try {
      const quizResponse = await axiosInstance.post('/quizzes', quizData);
      const quizId = quizResponse.data.data.quiz.id;
      
      await axiosInstance.post(`/quizzes/${quizId}/questions`, { questions });
      
      toast.success('Quiz created successfully!');
      navigate(`/lecturer/modules/${moduleId}/quizzes`);
    } catch (error) {
      toast.error('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold">Create New Quiz</h1>
          <div className="w-10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Basic Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-primary-600" />
              Quiz Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={2}
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={quizData.durationMinutes}
                  onChange={(e) => setQuizData({ ...quizData, durationMinutes: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </button>
            </div>

            {questions.map((q, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question {index + 1}</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Option A</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={q.optionA}
                      onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Option B</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={q.optionB}
                      onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Option C</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={q.optionC}
                      onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Option D</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={q.optionD}
                      onChange={(e) => handleQuestionChange(index, 'optionD', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Correct Option</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={q.correctOption}
                      onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)}
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marks</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={q.marks}
                      onChange={(e) => handleQuestionChange(index, 'marks', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuizPage;
