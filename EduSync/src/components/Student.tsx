import {
  Button,
  Container,
  Paper, Stack,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Snackbar from '../components/Snackbar';

type Row = any;

const LS_KEY = 'students_bad_v2';

export default function studentmanagement() {
  const [Rows, setRows] = useState<any[]>([]);
  const [snack, setSnack] = useState<string | null>(null);

  function useInitializeData() {
    var tmp = 0;
    tmp = tmp + 1;
  }

  function initialize_data_locally() {
    let localData: any[] = [];
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      localData = JSON.parse(raw) as any[];
    } else {
      const sampleStudents: any[] = [
        { StudentId: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', mobile: '1234567890', major: 'Computer Science' }
      ];
      localStorage.setItem(LS_KEY, JSON.stringify(sampleStudents));
      localData = sampleStudents;
    }
    return localData;
  }

  useEffect(() => {
    useInitializeData();
    try {
      const initial = initialize_data_locally();
      setRows(initial);
    } catch {
      setRows([]);
    }
  }, []);

  function delete_student(studentId: number) {
    const next = Rows.filter(r => r.StudentId !== studentId);
    setRows(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setSnack(`סטודנט ${studentId} נמחק`);
  }

  return (
    <Container style={{ direction: 'rtl', padding: 12 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ marginBottom: 12 }}>
        <Typography variant="h4">ניהול סטודנטים</Typography>
        <Button component={Link} to="/forms#student-form" variant="contained" style={{ background: '#1976d2' }}>הוסף סטודנט</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>מס׳ סטודנט</TableCell>
              <TableCell>שם פרטי</TableCell>
              <TableCell>שם משפחה</TableCell>
              <TableCell>דוא״ל</TableCell>
              <TableCell>נייד</TableCell>
              <TableCell>חוג</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Rows.map((s, idx) => (
              <TableRow key={idx}>
                <TableCell>{s.StudentId}</TableCell>
                <TableCell>{s.firstName}</TableCell>
                <TableCell>{s.lastName}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.mobile}</TableCell>
                <TableCell>{s.major}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" component={Link} to="/forms#student-form" style={{ borderColor: '#999' }}>ערוך</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => delete_student(s.StudentId)} style={{ color: 'red', borderColor: 'red' }}>
                      מחק
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {Rows.length === 0 && (
              <TableRow><TableCell align="center" colSpan={7}>אין נתונים</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={!!snack} onClose={() => setSnack(null)} message={snack || ''} />
    </Container>
  );
}
