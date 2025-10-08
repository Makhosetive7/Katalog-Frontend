// components/ChapterNotesModal.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Book } from '@/types/books';
import {
  useGetChapterNotesQuery,
  useCreateChapterNoteMutation,
  useDeleteChapterNoteMutation,
} from '@/redux/api/books';

interface ChapterNotesModalProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ChapterNotesModal({ book, open, onClose, onUpdate }: ChapterNotesModalProps) {
  const [chapter, setChapter] = useState('');
  const [note, setNote] = useState('');
  const [keywords, setKeywords] = useState('');

  // RTK Query hooks
  const { data: notesData, isLoading: fetching, refetch } = useGetChapterNotesQuery(book._id, {
    skip: !open,
  });
  const [createChapterNote, { isLoading: creating }] = useCreateChapterNoteMutation();
  const [deleteChapterNote] = useDeleteChapterNoteMutation();

  const notes = notesData || [];

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleSubmit = async () => {
    if (!chapter || !note) {
      alert('Chapter and note are required');
      return;
    }

    try {
      await createChapterNote({
        bookId: book._id,
        body: {
          chapter: parseInt(chapter),
          note,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          isPublic: false,
        },
      }).unwrap();

      console.log('Note created successfully');
      setChapter('');
      setNote('');
      setKeywords('');
      onUpdate?.();
      refetch(); 
    } catch (error: any) {
      console.error('Failed to create note:', error);
      alert(`Error: ${error.data?.error || 'Failed to create note'}`);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteChapterNote(noteId).unwrap();
      onUpdate?.();
      refetch(); 
    } catch (error: any) {
      console.error('Failed to delete note:', error);
      alert(`Error: ${error.data?.error || 'Failed to delete note'}`);
    }
  };

  const handleClose = () => {
    setChapter('');
    setNote('');
    setKeywords('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chapter Notes - {book.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Add New Note Form */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Add New Note
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Chapter"
                type="number"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g., 1"
                required
              />
              
              <TextField
                label="Note"
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes here..."
                required
              />
              
              <TextField
                label="Keywords (comma-separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., plot, character, theme"
              />
              
              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={<Add />}
                disabled={creating}
                sx={{ alignSelf: 'flex-start' }}
              >
                {creating ? 'Adding...' : 'Add Note'}
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Existing Notes List */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Existing Notes ({notes.length})
            </Typography>
            
            {fetching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : notes.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No notes yet. Add your first note above!
              </Typography>
            ) : (
              <List>
                {notes.map((noteItem) => (
                  <ListItem
                    key={noteItem._id}
                    sx={{
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.paper',
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteNote(noteItem._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle1" component="span">
                            Chapter {noteItem.chapter}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                            {new Date(noteItem.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" paragraph>
                            {noteItem.note}
                          </Typography>
                          {noteItem.keywords && noteItem.keywords.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {noteItem.keywords.map((keyword, index) => (
                                <Chip
                                  key={index}
                                  label={keyword}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}