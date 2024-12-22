import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

type Subject = {
  name: string;
  teacher: string;
  credits: string;
};

interface Timetable {
  [day: string]: {
    [slot: string]: string;
  };
}

const App: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [semesterData, setSemesterData] = useState<{
    semester: string;
    termStart: string;
    termEnd: string;
    roomNumber: string;
    numStudents: string;
    subjects: Subject[];
  }>({
    semester: '',
    termStart: '',
    termEnd: '',
    roomNumber: '',
    numStudents: '',
    subjects: [{ name: '', teacher: '', credits: '' }],
  });
  const [timetable, setTimetable] = useState<Timetable | null>(null);

  const timeSlots = [
    '9:00-9:55',
    '10:00-10:50',
    '11:05-12:00',
    '12:00-12:55',
    '13:45-14:40',
    '14:40-15:35',
    '15:35-16:30',
  ];

  const handlePullUpScreen = () => {
    setShowContent(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSemesterData({ ...semesterData, [name]: value });
  };

  const handleSubjectChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedSubjects = [...semesterData.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [name]: value };
    setSemesterData({ ...semesterData, subjects: updatedSubjects });
  };

  const addSubject = () => {
    setSemesterData({
      ...semesterData,
      subjects: [...semesterData.subjects, { name: '', teacher: '', credits: '' }],
    });
  };

  const generateTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newTimetable: Timetable = {};

    days.forEach((day) => {
      newTimetable[day] = {};
      timeSlots.forEach((slot) => {
        newTimetable[day][slot] = '';
      });
    });

    semesterData.subjects.forEach((subject) => {
      const [theory] = subject.credits.split(':').map(Number);

      for (let i = 0; i < theory; i++) {
        const day = days[Math.floor(Math.random() * days.length)];
        const slot = timeSlots[Math.floor(Math.random() * timeSlots.length)];

        if (!newTimetable[day][slot]) {
          newTimetable[day][slot] = `${subject.name} (Theory) - ${subject.teacher}`;
        }
      }
    });

    setTimetable(newTimetable);
  };

  const exportToExcel = () => {
    if (!timetable) return;

    const worksheet = XLSX.utils.json_to_sheet(
      Object.entries(timetable).flatMap(([day, slots]) =>
        Object.entries(slots).map(([slot, subject]) => ({
          Day: day,
          Time: slot,
          Subject: subject,
        }))
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetable');
    XLSX.writeFile(workbook, 'timetable.xlsx');
  };

  return (
    <div className="app">
      {!showContent ? (
        <div 
          className="pull-up-screen"
          onClick={handlePullUpScreen}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <h1 style={{ color: 'white', fontSize: '3rem' }}>Timetable Generator</h1>
        </div>
      ) : (
        <div className="content-container">
          <div className="form-container" style={{ 
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '2rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Semester Details</h2>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <input
                type="text"
                name="semester"
                placeholder="Semester"
                value={semesterData.semester}
                onChange={handleInputChange}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <input
                type="date"
                name="termStart"
                value={semesterData.termStart}
                onChange={handleInputChange}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <input
                type="date"
                name="termEnd"
                value={semesterData.termEnd}
                onChange={handleInputChange}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                value={semesterData.roomNumber}
                onChange={handleInputChange}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <input
                type="number"
                name="numStudents"
                placeholder="Number of Students"
                value={semesterData.numStudents}
                onChange={handleInputChange}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Subjects</h2>
            {semesterData.subjects.map((subject, index) => (
              <div key={index} style={{ 
                display: 'grid',
                gap: '1rem',
                marginBottom: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
              }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, e)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <input
                  type="text"
                  name="teacher"
                  placeholder="Teacher Name"
                  value={subject.teacher}
                  onChange={(e) => handleSubjectChange(index, e)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <input
                  type="text"
                  name="credits"
                  placeholder="Credits (theory:tutorial:practical)"
                  value={subject.credits}
                  onChange={(e) => handleSubjectChange(index, e)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
            ))}
            
            <div style={{ 
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem',
              marginBottom: '2rem'
            }}>
              <button
                onClick={addSubject}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Subject
              </button>
              <button
                onClick={generateTimetable}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Generate Timetable
              </button>
              <button
                onClick={exportToExcel}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#333333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Export to Excel
              </button>
            </div>

            {timetable && (
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Generated Timetable</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: 'white'
                  }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          border: '1px solid #ccc',
                          padding: '0.5rem',
                          backgroundColor: '#1b1b1b'
                        }}>Day</th>
                        {timeSlots.map((slot) => (
                          <th key={slot} style={{ 
                            border: '1px solid #ccc',
                            padding: '0.5rem',
                            backgroundColor: '#1b1b1b'
                          }}>{slot}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(timetable).map(([day, slots]) => (
                        <tr key={day}>
                          <td style={{ 
                            border: '1px solid #ccc',
                            padding: '0.5rem',
                            fontWeight: 'bold'
                          }}>{day}</td>
                          {timeSlots.map((slot) => (
                            <td key={slot} style={{ 
                              border: '1px solid #ccc',
                              padding: '0.5rem'
                            }}>{slots[slot] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

