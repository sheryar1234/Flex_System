import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3045/student');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchImages();
    fetchStudents();
  }, []);

  // Function to handle marking a student as present or absent
  const handleAttendance = async (studentId, isPresent) => {
    try {
      // Make a request to store attendance record
      await axios.post('http://localhost:3045/attendance', {
        studentId,
        status: isPresent ? 'present' : 'absent'
      });
      
      // Update the students state to reflect the changes
      setStudents(prevStudents => prevStudents.map(student => {
        if (student._id === studentId) {
          return { ...student, isPresent }; // Update the isPresent field in the frontend
        }
        return student;
      }));
    } catch (error) {
      console.error('Error storing attendance:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="border border-gray-300 p-4">
            <img src={`http://localhost:3000/${image.imagePath}`} alt={`Image ${index}`} className="w-full h-48 object-cover mb-4" />
            <p className="text-sm text-gray-600">Date: {new Date(image.date).toLocaleDateString()}</p>

            <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Student List</h2>
        <div className="space-y-2">
          {students.map((student) => (
            <div key={student._id} className="flex items-center">
              <p className="text-sm">{student.rollno} - {student.email}</p>
              <div className="ml-auto">
                <button className="btn btn-success mr-2" onClick={() => handleAttendance(student._id, true)}>
                  Present
                </button>
                <button className="btn btn-danger" onClick={() => handleAttendance(student._id, false)}>
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
          </div>
          
        ))}
      </div>
     
    </div>
  );
};

export default ImageGallery;
