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
import { useCreateReadingGoalMutation } from '@/redux/api/books';

interface ReadingGoalModalProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ReadingGoalModal({ book, open, onClose, onUpdate }: ReadingGoalModalProps) {
  const [type, setType] = useState('pages');
  const [target, setTarget] = useState('');
  const [timeFrame, setTimeFrame] = useState('custom');
  const [endDate, setEndDate] = useState('');
  
  const [createReadingGoal, { isLoading: loading }] = useCreateReadingGoalMutation();

  const goalTypes = [
    { value: 'pages', label: 'Pages' },
    { value: 'chapters', label: 'Chapters' },
    { value: 'time', label: 'Reading Time (minutes)' },
    { value: 'completion', label: 'Completion %' },
  ];

  const timeFrames = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom Date' },
  ];

  const handleSubmit = async () => {
    if (!target || !endDate) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await createReadingGoal({
        bookId: book._id,
        body: {
          type,
          target: parseInt(target),
          timeframe: timeFrame,
          endDate: new Date(endDate).toISOString(),
        },
      }).unwrap();

      console.log('Goal created successfully');
      onUpdate?.();
      handleClose();
    } catch (error: any) {
      console.error('Failed to create reading goal:', error);
      alert(`Error: ${error.data?.error || 'Failed to create reading goal'}`);
    }
  };

  const handleClose = () => {
    setType('pages');
    setTarget('');
    setTimeFrame('custom');
    setEndDate('');
    onClose();
  };

  const getTargetPlaceholder = () => {
    switch (type) {
      case 'pages': return 'e.g., 50';
      case 'chapters': return 'e.g., 5';
      case 'time': return 'e.g., 120 (minutes)';
      case 'completion': return 'e.g., 100 (%)';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Set Reading Goal - {book.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Goal Type</InputLabel>
            <Select
              value={type}
              label="Goal Type"
              onChange={(e) => setType(e.target.value)}
            >
              {goalTypes.map((goal) => (
                <MenuItem key={goal.value} value={goal.value}>
                  {goal.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Target"
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={getTargetPlaceholder()}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Time Frame</InputLabel>
            <Select
              value={timeFrame}
              label="Time Frame"
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              {timeFrames.map((frame) => (
                <MenuItem key={frame.value} value={frame.value}>
                  {frame.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />

          <Typography variant="body2" color="text.secondary">
            Current: {book.currentPage}/{book.pages} pages • {Math.round((book.currentPage / book.pages) * 100)}% complete
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
          {loading ? 'Creating...' : 'Set Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}