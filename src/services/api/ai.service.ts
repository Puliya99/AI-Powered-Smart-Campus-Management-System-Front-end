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
    const response = await axiosInstance.post(`/ai/materials/${materialId}/process`, {}, {
      timeout: 120000 // Increase timeout to 120 seconds for processing materials
    });
    return response.data;
  },

  askQuestion: async (courseId: string, question: string): Promise<ChatResponse> => {
    const response = await axiosInstance.post('/ai/chat/ask', { courseId, question }, {
      timeout: 60000 // Increase timeout to 60 seconds for AI chat
    });
    return response.data.data;
  },

  predictExamRisk: async (studentId: string, moduleId: string) => {
    const response = await axiosInstance.post('/ai/predict-exam-risk', { studentId, moduleId }, {
      timeout: 60000 // Increase timeout to 60 seconds for exam risk prediction
    });
    return response.data;
  }
};

export default aiService;
