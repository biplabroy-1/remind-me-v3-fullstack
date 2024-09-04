// src/components/ScheduleForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleForm = () => {
    const [ID, setID] = useState('');
    const [selectedID, setSelectedID] = useState('');
    const [semester, setSemester] = useState('');
    const [program, setProgram] = useState('');
    const [section, setSection] = useState('');
    const [university, setUniversity] = useState('');
    const [schedule, setSchedule] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });
    const [allIDs, setAllIDs] = useState([]);

    // Fetch all IDs from the server
    useEffect(() => {
        const fetchIDs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/ids');
                setAllIDs(response.data.ids);
            } catch (error) {
                console.error('Error fetching IDs:', error);
            }
        };

        fetchIDs();
    }, []);

    useEffect(() => {
        // Automatically update the ID based on the program, section, and semester
        if (program && section && semester && university) {
            setID(`${university}-${program}-${section}-${semester}`);
        } else {
            setID('');
        }
    }, [program, section, semester, university]);

    useEffect(() => {
        if (selectedID) {
            const fetchScheduleByID = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/schedules/${selectedID}`);
                    const { semester, program, section, university, schedule } = response.data;
                    setSemester(semester);
                    setProgram(program);
                    setSection(section);
                    setSchedule(schedule);
                    setUniversity(university)
                    setID(selectedID);
                } catch (error) {
                    console.error('Error fetching schedule:', error);
                }
            };

            fetchScheduleByID();
        }
    }, [selectedID]);

    const handleAddClass = (day) => {
        const newClass = {
            Period: 1,
            Start_Time: '',
            Course_Name: '',
            Instructor: '',
            Room: '',
            Group: 'All',
            Class_Duration: 1,
            Class_type: 'Theory'
        };
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [day]: [...prevSchedule[day], newClass]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'program') setProgram(value);
        if (name === 'section') setSection(value);
        if (name === 'semester') setSemester(value);
        if (name === 'university') setUniversity(value);
    };

    const handleClassChange = (day, index, field, value) => {
        const updatedDaySchedule = schedule[day].map((cls, idx) => {
            if (idx === index) {
                return { ...cls, [field]: value };
            }
            return cls;
        });
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [day]: updatedDaySchedule
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/add', {
                ID,
                semester,
                program,
                section,
                university,
                schedule
            });
            alert(response.data.message);
        } catch (error) {
            console.error('There was an error adding the schedule:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="selectedID">
                    Select ID:
                </label>
                <select
                    id="selectedID"
                    className="shadow cursor-pointer appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedID}
                    onChange={(e) => setSelectedID(e.target.value)}
                >
                    <option className='hidden' value="">Select Existing ID</option>
                    {allIDs.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="ID">
                    ID:
                </label>
                <input
                    id="ID"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="ID"
                    value={ID}
                    readOnly
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="program">
                    University:
                </label>
                <input
                    id="university"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="university"
                    value={university}
                    onChange={handleInputChange}
                    placeholder="Enter university (e.g., BWU)"
                    readOnly={!!selectedID}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="program">
                    Program:
                </label>
                <input
                    id="program"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="program"
                    value={program}
                    onChange={handleInputChange}
                    placeholder="Enter Program (e.g., BCA)"
                    readOnly={!!selectedID}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="section">
                    Section:
                </label>
                <input
                    id="section"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="section"
                    value={section}
                    onChange={handleInputChange}
                    placeholder="Enter Section (e.g., A)"
                    readOnly={!!selectedID}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="semester">
                    Semester:
                </label>
                <select
                    id="semester"
                    className="shadow cursor-pointer appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="semester"
                    value={semester}
                    onChange={handleInputChange}
                    disabled={!!selectedID}
                >
                    <option className='hidden' value="">Select Semester</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="VI">VI</option>
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                </select>
            </div>

            {Object.keys(schedule).map((day) => (
                <div key={day} className="mb-4">
                    <h3 className="text-gray-700 font-bold mb-2">{day}</h3>
                    {schedule[day].map((cls, index) => (
                        <div key={index} className="bg-gray-100 p-4 mb-2 rounded">
                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-period-${index}`}>
                                    Period:
                                </label>
                                <select
                                    id={`${day}-period-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={cls.Period}
                                    onChange={(e) => handleClassChange(day, index, 'Period', e.target.value)}
                                >
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-start-time-${index}`}>
                                    Start Time:
                                </label>
                                <input
                                    id={`${day}-start-time-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="time"
                                    value={cls.Start_Time}
                                    onChange={(e) => handleClassChange(day, index, 'Start_Time', e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-course-name-${index}`}>
                                    Course Name:
                                </label>
                                <input
                                    id={`${day}-course-name-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={cls.Course_Name}
                                    onChange={(e) => handleClassChange(day, index, 'Course_Name', e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-instructor-${index}`}>
                                    Instructor:
                                </label>
                                <input
                                    id={`${day}-instructor-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={cls.Instructor}
                                    onChange={(e) => handleClassChange(day, index, 'Instructor', e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-room-${index}`}>
                                    Room:
                                </label>
                                <input
                                    id={`${day}-room-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={cls.Room}
                                    onChange={(e) => handleClassChange(day, index, 'Room', e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-group-${index}`}>
                                    Group:
                                </label>
                                <select
                                    id={`${day}-group-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={cls.Group}
                                    onChange={(e) => handleClassChange(day, index, 'Group', e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Group 1">Group 1</option>
                                    <option value="Group 2">Group 2</option>
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-class-duration-${index}`}>
                                    Class Duration:
                                </label>
                                <select
                                    id={`${day}-class-duration-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={cls.Class_Duration}
                                    onChange={(e) => handleClassChange(day, index, 'Class_Duration', parseInt(e.target.value))}
                                >
                                    {[1, 2, 3, 4].map((duration) => (
                                        <option key={duration} value={duration}>
                                            {duration} hour{duration > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor={`${day}-class-type-${index}`}>
                                    Class Type:
                                </label>
                                <select
                                    id={`${day}-class-type-${index}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={cls.Class_type}
                                    onChange={(e) => handleClassChange(day, index, 'Class_type', e.target.value)}
                                >
                                    <option value="Theory">Theory</option>
                                    <option value="Lab">Lab</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="bg-blue-500 duration-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleAddClass(day)}
                    >
                        Add New Class to {day}
                    </button>
                </div>
            ))}

            <button
                type="submit"
                className="bg-blue-500 duration-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Add/Update Schedule
            </button>
        </form>
    );
};

export default ScheduleForm;