import {
  Button,
  Container,
  Paper, Stack,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TableRow,
  Typography
} from '@mui/material';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Snackbar from '../components/Snackbar';
import { db } from '../firebase';

type Row = {
  StudentId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  major: string;
  id?: string; // Firestore document ID
};

const LS_KEY = 'students_v1';

export default function StudentManagement() {
  const [rows, setRows] = useState<Row[]>([]);
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Step 1: Initialize localStorage with sample data if empty
        let localData: Row[] = [];
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          localData = JSON.parse(raw) as Row[];
        } else {
          const sampleStudents: Row[] = [
            { StudentId: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', mobile: '1234567890', major: 'Computer Science' }
          ];
          localStorage.setItem(LS_KEY, JSON.stringify(sampleStudents));
          localData = sampleStudents;
        }

        // Step 2: Sync localStorage to Firestore if Firestore is empty
        const studentsCollection = collection(db, 'students');
        const snapshot = await getDocs(studentsCollection);
        if (snapshot.empty && localData.length > 0) {
          const firstStudent = localData[0];
          const q = query(studentsCollection, where('StudentId', '==', firstStudent.StudentId));
          const existingDocs = await getDocs(q);
          if (existingDocs.empty) {
            await addDoc(studentsCollection, {
              StudentId: firstStudent.StudentId,
              firstName: firstStudent.firstName,
              lastName: firstStudent.lastName,
              email: firstStudent.email,
              mobile: firstStudent.mobile,
              major: firstStudent.major
            });
            setSnack('סטודנט ראשון נוסף ל-Firestore');
          }
        }

        // Step 3: Load data from Firestore for the table
        const updatedSnapshot = await getDocs(studentsCollection);
        const students = updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Row));
        setRows(students);

        // Step 4: Sync localStorage with Firestore data
        localStorage.setItem(LS_KEY, JSON.stringify(students.map(({ id, ...rest }) => rest)));
      } catch (error) {
        console.error('Error initializing data:', error);
        setSnack('שגיאה בטעינת נתונים');
        const raw = localStorage.getItem(LS_KEY);
        setRows(raw ? (JSON.parse(raw) as Row[]) : []);
      }
    };

    initializeData();
  }, []);

  const handleDelete = async (studentId: number, docId?: string) => {
    try {
      if (docId) {
        await deleteDoc(doc(db, 'students', docId));
      }
      const next = rows.filter(r => r.StudentId !== studentId);
      setRows(next);
      localStorage.setItem(LS_KEY, JSON.stringify(next.map(({ id, ...rest }) => rest)));
      setSnack(`סטודנט ${studentId} נמחק`);
    } catch (error) {
      console.error('Error deleting student:', error);
      setSnack('שגיאה במחיקת סטודנט');
    }
  };

  return (
    <Container sx={{ direction: 'rtl', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">ניהול סטודנטים</Typography>
        <Button component={Link} to="/forms" variant="contained">הוסף סטודנט</Button>
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
            {rows.map((s) => (
              <TableRow key={s.StudentId}>
                <TableCell>{s.StudentId}</TableCell>
                <TableCell>{s.firstName}</TableCell>
                <TableCell>{s.lastName}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.mobile}</TableCell>
                <TableCell>{s.major}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" component={Link} to="/forms">ערוך</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(s.StudentId, s.id)}>מחק</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell align="center" colSpan={7}>אין נתונים</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={!!snack} onClose={() => setSnack(null)} message={snack || ''} />
    </Container>
  );
}