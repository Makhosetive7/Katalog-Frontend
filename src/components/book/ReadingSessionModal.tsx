import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { Book } from '@/types/books';
import { useCreateReadingSessionMutation } from '@/redux/api/books';

interface ReadingSessionModalProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ReadingSessionModal({ book, open, onClose, onUpdate }: ReadingSessionModalProps) {
  const [pagesRead, setPagesRead] = useState('');
  const [chaptersRead, setChaptersRead] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [mood, setMood] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [createReadingSession, { isLoading: loading }] = useCreateReadingSessionMutation();

  const moods = [
    'excited',
    'focused',
    'relaxed',
    'bored',
    'confused',
    'inspired',
    'neutral'
  ];

  const handleSubmit = async () => {
    if (!pagesRead && !chaptersRead) {
      alert('Please enter pages read or chapters read');
      return;
    }

    try {
      await createReadingSession({
        bookId: book._id,
        body: {
          pagesRead: parseInt(pagesRead) || 0,
          chaptersRead: parseInt(chaptersRead) || 0,
          readingTime: parseInt(readingTime) || 0,
          mood,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
        },
      }).unwrap();

      console.log('Session created successfully');
      onUpdate?.();
      handleClose();
    } catch (error: any) {
      console.error('Failed to create reading session:', error);
      alert(`Error: ${error.data?.error || 'Failed to create reading session'}`);
    }
  };

  const handleClose = () => {
    setPagesRead('');
    setChaptersRead('');
    setReadingTime('');
    setMood('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Log Reading Session - {book.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Pages Read"
            type="number"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            placeholder="e.g., 25"
            helperText="Leave empty if logging by chapters"
          />
          
          <TextField
            label="Chapters Read"
            type="number"
            value={chaptersRead}
            onChange={(e) => setChaptersRead(e.target.value)}
            placeholder="e.g., 1"
            helperText="Leave empty if logging by pages"
          />
          
          <TextField
            label="Reading Time (minutes)"
            type="number"
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            placeholder="e.g., 45"
          />
          
          <FormControl fullWidth>
            <InputLabel>Mood</InputLabel>
            <Select
              value={mood}
              label="Mood"
              onChange={(e) => setMood(e.target.value)}
            >
              <MenuItem value="">Select mood</MenuItem>
              {moods.map((moodOption) => (
                <MenuItem key={moodOption} value={moodOption}>
                  {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <Typography variant="body2" color="text.secondary">
            Current progress: {book.currentPage}/{book.pages} pages
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Logging...' : 'Log Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}