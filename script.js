let tableBody = document.getElementById("studentTableBody");
let today = document.getElementById("todayLabel")
today.innerHTML = `${Date()}`
let avg = document.getElementById("averageCgpa")
let totalStudents = document.getElementById("totalStudents")
let activePrograms = document.getElementById("activePrograms")
let departments = []
let averageAttendance = document.getElementById("averageAttendance")

fetch("student.xml")
    .then((response) => response.text())
    .then((xmlText) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlText, "text/xml");
        let students = xmlDoc.getElementsByTagName("student");
        let rows = "";
        let totalAvg = 0
        let totalAttendance = 0


        for (let student of students) {
            let studentId = student.getElementsByTagName("studentId")[0].textContent;
            let name = student.getElementsByTagName("name")[0].textContent;
            let age = student.getElementsByTagName("age")[0].textContent;
            let classLevel = student.getElementsByTagName("classLevel")[0].textContent;
            let department = student.getElementsByTagName("department")[0].textContent;
            let email = student.getElementsByTagName("email")[0].textContent;
            let attendance = Number(student.getElementsByTagName("attendance")[0].textContent);
            let cgpa = Number(student.getElementsByTagName("cgpa")[0].textContent);
            let status = student.getElementsByTagName("status")[0].textContent;
            totalAvg += cgpa
            departments.push(department)
            totalAttendance += attendance
            rows += `
            <tr>
                <td>${studentId}</td>
                <td>${name}</td>
                <td>${age}</td>
                <td>${classLevel}</td>
                <td>${department}</td>
                <td>${email}</td>
                <td>${attendance}</td>
                <td>${cgpa}</td>
                <td>${status}</td>
            </tr>`;
        }
        let avgCgpa = totalAvg / students.length 
        avg.textContent = avgCgpa.toFixed(2)
        let avgAttendance = totalAttendance / students.length
        averageAttendance.textContent = avgAttendance
        tableBody.innerHTML = rows;

        totalStudents.textContent = students.length
        departments.forEach((num) => {
            activePrograms.textContent = num.length
        })
    });
