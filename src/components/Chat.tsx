// src/components/Chat.tsx

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Import MUI Components
import { Box, TextField, Button, Typography, Paper, CircularProgress, Container, Alert } from '@mui/material';

// Define the structure of the API response
interface RAGResponse {
  answer: string;
  sources: string[];
}

// Define the structure of the request payload
interface RAGRequest {
    question: string;
    collection_names: string[];
}

// Get the API URL from the environment variable we set up
const API_URL = `${import.meta.env.VITE_API_URL}/query`;

// The function that calls the API
const askButlerAPI = async (payload: RAGRequest): Promise<RAGResponse> => {
    const { data } = await axios.post(API_URL, payload);
    return data;
};


export function Chat() {
  const [question, setQuestion] = useState('');

  const mutation = useMutation({
    mutationFn: askButlerAPI,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Call the mutation to send the question to the API
    mutation.mutate({
        question: question,
        collection_names: ["Paragraph"] // Search all collections
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ask Butler
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Your Question"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={mutation.isPending}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={mutation.isPending}
            sx={{ minWidth: 100 }}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : 'Ask'}
          </Button>
        </Box>

        {/* Display Results */}
        {mutation.isSuccess && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>Answer:</Typography>
            <Alert severity="success" sx={{ whiteSpace: 'pre-wrap' }}>{mutation.data.answer}</Alert>
            <Typography variant="h6" mt={2} gutterBottom>Sources:</Typography>
            <ul>
              {mutation.data.sources.map((source, index) => (
                <li key={index}><Typography variant="body2">{source}</Typography></li>
              ))}
            </ul>
          </Box>
        )}

        {mutation.isError && (
            <Box mt={4}>
                <Alert severity="error">Error: {mutation.error.message}</Alert>
            </Box>
        )}
      </Paper>
    </Container>
  );
}