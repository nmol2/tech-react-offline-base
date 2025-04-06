import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Report } from '../types/Report';
import { dbService } from '../services/db';

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [formData, setFormData] = useState<Omit<Report, 'id' | 'date'>>({
    title: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const loadedReports = statusFilter === 'all' 
        ? await dbService.getAllReports()
        : await dbService.getReportsByStatus(statusFilter);
      setReports(loadedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      await loadReports();
      return;
    }
    try {
      const searchResults = await dbService.searchReports(query);
      setReports(searchResults);
    } catch (error) {
      console.error('Error searching reports:', error);
    }
  };

  const handleOpen = (report?: Report) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        title: report.title,
        description: report.description,
        status: report.status,
      });
    } else {
      setEditingReport(null);
      setFormData({
        title: '',
        description: '',
        status: 'active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingReport(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingReport) {
        const updatedReport = { ...editingReport, ...formData };
        await dbService.updateReport(updatedReport);
        setReports(reports.map((r) =>
          r.id === editingReport.id ? updatedReport : r
        ));
      } else {
        const newReport: Report = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...formData,
        };
        await dbService.addReport(newReport);
        setReports([...reports, newReport]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteReport(id);
      setReports(reports.filter((report) => report.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="small"
          sx={{ 
            height: 36,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Create Report
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'archived')}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(report)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(report.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingReport ? 'Edit Report' : 'Create Report'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'archived' })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingReport ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 