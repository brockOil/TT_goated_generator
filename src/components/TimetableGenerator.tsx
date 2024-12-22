'use client'

import React, { useState } from 'react'
import * as XLSX from 'xlsx'

interface Subject {
  name: string
  teacher: string
  credits: string
}

interface Timetable {
  [day: string]: {
    [slot: string]: string
  }
}

const TimetableGenerator: React.FC = () => {
  const [semesterData, setSemesterData] = useState({
    semester: '',
    termStart: '',
    termEnd: '',
    roomNumber: '',
    numStudents: '',
    subjects: [{ name: '', teacher: '', credits: '' }],
  })
  const [timetable, setTimetable] = useState<Timetable | null>(null)

  const timeSlots = [
    '9:00-9:55',
    '10:00-10:50',
    '11:05-12:00',
    '12:00-12:55',
    '13:45-14:40',
    '14:40-15:35',
    '15:35-16:30',
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSemesterData({ ...semesterData, [name]: value })
  }

  const handleSubjectChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    const updatedSubjects = [...semesterData.subjects]
    updatedSubjects[index] = { ...updatedSubjects[index], [name]: value }
    setSemesterData({ ...semesterData, subjects: updatedSubjects })
  }

  const addSubject = () => {
    setSemesterData({
      ...semesterData,
      subjects: [...semesterData.subjects, { name: '', teacher: '', credits: '' }],
    })
  }

  const generateTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const newTimetable: Timetable = {}

    days.forEach((day) => {
      newTimetable[day] = {}
      timeSlots.forEach((slot) => {
        newTimetable[day][slot] = ''
      })
    })

    semesterData.subjects.forEach((subject) => {
      const [theory] = subject.credits.split(':').map(Number)

      for (let i = 0; i < theory; i++) {
        const day = days[Math.floor(Math.random() * days.length)]
        const slot = timeSlots[Math.floor(Math.random() * timeSlots.length)]

        if (!newTimetable[day][slot]) {
          newTimetable[day][slot] = `${subject.name} (Theory) - ${subject.teacher}`
        }
      }
    })

    setTimetable(newTimetable)
  }

  const exportToExcel = () => {
    if (!timetable) return

    const worksheet = XLSX.utils.json_to_sheet(
      Object.entries(timetable).flatMap(([day, slots]) =>
        Object.entries(slots).map(([slot, subject]) => ({
          Day: day,
          Time: slot,
          Subject: subject,
        }))
      )
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetable')
    XLSX.writeFile(workbook, 'timetable.xlsx')
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 animate-fade-in-up font-serif">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <input
          type="text"
          name="semester"
          placeholder="Semester"
          value={semesterData.semester}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        />
        <input
          type="date"
          name="termStart"
          value={semesterData.termStart}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        />
        <input
          type="date"
          name="termEnd"
          value={semesterData.termEnd}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        />
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={semesterData.roomNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        />
        <input
          type="number"
          name="numStudents"
          placeholder="Number of Students"
          value={semesterData.numStudents}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Subjects</h2>
      {semesterData.subjects.map((subject, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={subject.name}
            onChange={(e) => handleSubjectChange(index, e)}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
          />
          <input
            type="text"
            name="teacher"
            placeholder="Teacher Name"
            value={subject.teacher}
            onChange={(e) => handleSubjectChange(index, e)}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
          />
          <input
            type="text"
            name="credits"
            placeholder="Credits (theory:tutorial:practical)"
            value={subject.credits}
            onChange={(e) => handleSubjectChange(index, e)}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
          />
        </div>
      ))}
      <div className="flex flex-wrap justify-between mb-8">
        <button 
          onClick={addSubject}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300 mb-2 sm:mb-0"
        >
          Add Subject
        </button>
        <button 
          onClick={generateTimetable}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300 mb-2 sm:mb-0"
        >
          Generate Timetable
        </button>
        <button 
          onClick={exportToExcel}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300 mb-2 sm:mb-0"
        >
          Export to Excel
        </button>
      </div>

      {timetable && (
        <div className="mt-12 overflow-x-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Generated Timetable</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-100">
                <th className="border p-2">Day</th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="border p-2">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(timetable).map(([day, slots]) => (
                <tr key={day} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="border p-2 font-semibold">{day}</td>
                  {timeSlots.map((slot) => (
                    <td key={slot} className="border p-2">{slots[slot] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TimetableGenerator

