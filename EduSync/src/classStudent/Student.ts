import { isValidEmail, isValidMobile, isValidStudentId, validateText } from '../Functions/Utils';

export interface StudentProps {
  StudentId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  major: string;
}

export default class Student {
  StudentId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  major: string;

  constructor(props: StudentProps) {
    this.StudentId = Number(props.StudentId);
    this.firstName = String(props.firstName).trim();
    this.lastName = String(props.lastName).trim();
    this.email = String(props.email).trim();
    this.mobile = String(props.mobile).trim();
    this.major = String(props.major).trim();
  }

  validateStudent(): string[] {
    const errs: string[] = [];
    try { isValidStudentId(this.StudentId); } catch (e: any) { errs.push(e?.message ?? 'StudentId לא תקין'); }
    try { validateText(this.firstName); } catch { errs.push('שם פרטי לא תקין'); }
    try { validateText(this.lastName); } catch { errs.push('שם משפחה לא תקין'); }
    try { isValidEmail(this.email); } catch { errs.push('דוא״ל לא תקין'); }
    try { isValidMobile(this.mobile); } catch { errs.push('נייד לא תקין'); }
    try { validateText(this.major); } catch { errs.push('חוג/תואר לא תקין'); }
    return errs;
  }

  static from(o: Partial<StudentProps>): Student {
    return new Student({
      StudentId: Number(o?.StudentId ?? 0),
      firstName: String(o?.firstName ?? '').trim(),
      lastName: String(o?.lastName ?? '').trim(),
      email: String(o?.email ?? '').trim(),
      mobile: String(o?.mobile ?? '').trim(),
      major: String(o?.major ?? '').trim(),
    });
  }

  static random(existingIds?: Set<number>): Student {
    const MIN_ID = 100_000;
    const MAX_ID = 999_999;

    let id: number;
    do {
      id = MIN_ID + Math.floor(Math.random() * (MAX_ID - MIN_ID + 1));
    } while (existingIds?.has(id));

    const firstNames = ['Dana', 'Noa', 'Gal', 'Shahar', 'Lior', 'Ido'];
    const lastNames = ['Levi', 'Cohen', 'Mizrahi', 'Aviv', 'Rosen', 'Bar'];
    const majors = ['Computer Science', 'Education', 'Math', 'Economics', 'Biology'];

    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`;

    const digits = () => Math.floor(Math.random() * 10);
    const mobile = `05${digits()}${digits()}${digits()}${digits()}${digits()}${digits()}${digits()}${digits()}`;

    return new Student({
      StudentId: id,
      firstName: fn,
      lastName: ln,
      email,
      mobile,
      major,
    });
  }
}
