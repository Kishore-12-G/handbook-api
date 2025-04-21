const axios = require('axios');

class RagService {
    constructor(){
        this.ragApiUrl = process.env.RAG_API_URL||"https://ta-handbook-bot-api.onrender.com:10000";
    }
    /**
     * Send query to the Rag API
     * @param {String} question - The user's question
     * @param {boolean} restMemory - whether to reset the conversation memory
     * @return {Promise<string>} - The Rag model's response
     */

    async askQuestion(question,resetMemory = false){
        try{
            const response = await axios.post(`${this.ragApiUrl}/ask`,{
                question,
                resetMemory:resetMemory
            });

            return response.data.answer;
        }catch(error){
            console.error('Error communicating with the RAG API:',error.message);
            throw new Error('Failed to get the response from the RAG system')
        }
    }
}
module.exports = new RagService();