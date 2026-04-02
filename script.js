let tableBody = document.getElementById("studentTableBody");
let today = document.getElementById("todayLabel");
let avg = document.getElementById("averageCgpa");
let totalStudents = document.getElementById("totalStudents");
let activePrograms = document.getElementById("activePrograms");
let averageAttendance = document.getElementById("averageAttendance");
let topDepartment = document.getElementById("topDepartment");
let scholarshipStudents = document.getElementById("scholarshipCount");
let probationCount = document.getElementById("probationCount");
let topPerformerName = document.getElementById("topPerformer");
let topPerformerMeta = document.getElementById("topPerformerMeta");
let studentForm = document.getElementById("studentForm");

let date = new Date();
today.textContent = date.toDateString();

let studentsData = [];

function getStatusClass(status) {
    if (status === "Scholarship") return "status-scholarship";
    if (status === "Probation") return "status-probation";
    return "status-active";
}

function renderDashboard() {
    let departmentCounts = {};
    let totalCgpa = 0;
    let totalAttendance = 0;
    let scholarshipCount = 0;
    let probationStudents = 0;
    let topStudent = null;

    studentsData.forEach((student) => {
        totalCgpa += student.cgpa;
        totalAttendance += student.attendance;

        if (student.status === "Scholarship") {
            scholarshipCount++;
        }

        if (student.status === "Probation") {
            probationStudents++;
        }

        departmentCounts[student.department] = (departmentCounts[student.department] || 0) + 1;

        if (!topStudent || student.cgpa > topStudent.cgpa) {
            topStudent = student;
        }
    });

    let total = studentsData.length;
    let departmentNames = Object.keys(departmentCounts);
    let bestDepartment = departmentNames.sort((a, b) => departmentCounts[b] - departmentCounts[a])[0] || "-";

    totalStudents.textContent = total;
    activePrograms.textContent = departmentNames.length;
    avg.textContent = total ? (totalCgpa / total).toFixed(2) : "0.00";
    averageAttendance.textContent = total ? `${(totalAttendance / total).toFixed(0)}%` : "0%";
    topDepartment.textContent = bestDepartment;
    scholarshipStudents.textContent = scholarshipCount;
    probationCount.textContent = probationStudents;
    topPerformerName.textContent = topStudent ? topStudent.name : "-";
    topPerformerMeta.textContent = topStudent ? `${topStudent.cgpa.toFixed(2)} CGPA` : "Waiting for records";
}

function renderTable() {
    if (!studentsData.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">No student records found.</td>
            </tr>`;
        return;
    }

    let rows = studentsData.map((student) => `
        <tr>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.classLevel}</td>
            <td>${student.department}</td>
            <td>${student.email}</td>
            <td>${student.cgpa.toFixed(2)}</td>
            <td>${student.attendance}</td>
            <td><span class="status-pill ${getStatusClass(student.status)}">${student.status}</span></td>
            <td class="actions-cell">
                <button class="delete-btn" onclick="deleteStudent('${student.studentId}')">Delete</button>
            </td>
        </tr>
    `).join("");

    tableBody.innerHTML = rows;
}

function deleteStudent(studentId) {
    studentsData = studentsData.filter((student) => student.studentId !== studentId);

    let savedStudents = JSON.parse(localStorage.getItem("students")) || [];
    let updatedSavedStudents = savedStudents.filter((student) => student.studentId !== studentId);

    localStorage.setItem("students", JSON.stringify(updatedSavedStudents));

    renderAll();
}

function renderAll() {
    renderTable();
    renderDashboard();
}

fetch("student.xml")
    .then((response) => response.text())
    .then((xmlText) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlText, "text/xml");
        let students = xmlDoc.getElementsByTagName("student");

        let loadedStudents = Array.from(students).map((student) => ({
            studentId: student.getElementsByTagName("studentId")[0].textContent,
            name: student.getElementsByTagName("name")[0].textContent,
            age: Number(student.getElementsByTagName("age")[0].textContent),
            classLevel: student.getElementsByTagName("classLevel")[0].textContent,
            department: student.getElementsByTagName("department")[0].textContent,
            email: student.getElementsByTagName("email")[0].textContent,
            attendance: Number(student.getElementsByTagName("attendance")[0].textContent),
            cgpa: Number(student.getElementsByTagName("cgpa")[0].textContent),
            status: student.getElementsByTagName("status")[0].textContent
        }));

        let localStudent = JSON.parse(localStorage.getItem("students")) || [];
        studentsData = [...loadedStudents, ...localStudent];

        renderAll();
    })
    .catch(() => {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">Student records load nahi ho sake.</td>
            </tr>`;
    });

studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let age = Number(document.getElementById("age").value);
    let classLevel = document.getElementById("classLevel").value.trim();
    let department = document.getElementById("department").value.trim();
    let cgpa = Number(document.getElementById("cgpa").value);
    let status = document.getElementById("status").value;

    if (name === "") {
        alert("Name required!");
        return;
    }
    if (age < 14 || age > 30) {
        alert("Age 14-30 ke beech hona chahiye!");
        return;
    }
    if (classLevel === "") {
        alert("Class/Semester required!");
        return;
    }
    if (department === "") {
        alert("Department required!");
        return;
    }
    if (cgpa < 0 || cgpa > 4) {
        alert("CGPA 0-4 ke beech hona chahiye!");
        return;
    }
    if (status === "") {
        alert("Status select karo!");
        return;
    }

    let studentId = "SMS-" + (2417 + studentsData.length);
    let emailHandle = name.toLowerCase().replace(/\s+/g, ".");

    let newStudent = ({
        studentId: studentId,
        name: name,
        age: age,
        classLevel: classLevel,
        department: department,
        email: `${emailHandle}@aptech.edu.pk`,
        attendance: 0,
        cgpa: cgpa,
        status: status
    });

    studentsData.push(newStudent)

  let savedStudent = JSON.parse(localStorage.getItem("students")) || []
  savedStudent.push(newStudent)
  localStorage.setItem("students" , JSON.stringify(savedStudent))


    renderAll();
    studentForm.reset();
});
