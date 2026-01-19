import axiosInstance from './axios.config';

export interface ChatCitation {
  materialId: string;
  metadata: {
    page?: number;
    slide?: number;
    offset?: number;
    paragraph_index?: number;
  };
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  citations: ChatCitation[];
}

export const aiService = {
  processMaterial: async (materialId: string) => {
    const response = await axiosInstance.post(`/ai/materials/${materialId}/process`);
    return response.data;
  },

  askQuestion: async (courseId: string, question: string): Promise<ChatResponse> => {
    const response = await axiosInstance.post('/ai/chat/ask', { courseId, question });
    return response.data.data;
  },

  predictExamRisk: async (studentId: string, moduleId: string) => {
    const response = await axiosInstance.post('/ai/predict-exam-risk', { studentId, moduleId });
    return response.data;
  }
};

export default aiService;
