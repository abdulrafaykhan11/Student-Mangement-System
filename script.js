let tableBody = document.getElementById("studentTableBody");
let today = document.getElementById("todayLabel")
let date = new Date()
today.innerHTML = date.toDateString("en-PK")
let avg = document.getElementById("averageCgpa")
let totalStudents = document.getElementById("totalStudents")
let activePrograms = document.getElementById("activePrograms")
let departments = []
let averageAttendance = document.getElementById("averageAttendance")
let topDepartment = document.getElementById("topDepartment")
let scholarshipStudents = document.getElementById("scholarshipCount")
let probationCount = document.getElementById("probationCount")
let topPerformerName = document.getElementById("topPerformer")
let topPerformerMeta = document.getElementById("topPerformerMeta")
let cgpaArray = []
let StudentNames = []
let topPerformer = ""

fetch("student.xml")
    .then((response) => response.text())
    .then((xmlText) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlText, "text/xml");
        let students = xmlDoc.getElementsByTagName("student");
        let rows = "";
        let totalAvg = 0
        let totalScholarship = 0
        let totalAttendance = 0
        let totalProbation = 0


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
            scholarshipStudents.textContent = totalScholarship
            departments.push(department)
            topDepartment.textContent = departments.sort((a,b) => {
                departments.filter(x => x === b).length - departments.filter(x => x===a).length
            })[0]
            cgpaArray.push(cgpa)
            StudentNames.push(name)
            


            if(status === "Scholarship"){
                totalScholarship++
            }
            else if(status === "Probation"){
                totalProbation++
            }
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
        scholarshipStudents.textContent = totalScholarship
        let avgCgpa = totalAvg / students.length 
        avg.textContent = avgCgpa.toFixed(2)
        let avgAttendance = totalAttendance / students.length
        averageAttendance.textContent = avgAttendance
        tableBody.innerHTML = rows;
        probationCount.textContent = totalProbation
        


        let maxCgpa = Math.max(...cgpaArray);
        let topIndex = cgpaArray.indexOf(maxCgpa)
        topPerformer = StudentNames[topIndex]


        topPerformerName.textContent = topPerformer
        topPerformerMeta.textContent = maxCgpa
        

        totalStudents.textContent = students.length
        departments.forEach((num) => {
            activePrograms.textContent = num.length
        })
    });


let studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", function(e) {
    e.preventDefault();  // Form submit na ho
    
    let name = document.getElementById("name").value.trim();
    let age = Number(document.getElementById("age").value);
    let classLevel = document.getElementById("classLevel").value.trim();
    let department = document.getElementById("department").value.trim();
    let cgpa = Number(document.getElementById("cgpa").value);
    let status = document.getElementById("status").value;
    
    // VALIDATION
    if(name === "") {
        alert("Name required!");
        return;
    }
    if(age < 14 || age > 30) {
        alert("Age 14-30 ke beech hona chahiye!");
        return;
    }
    if(classLevel === "") {
        alert("Class/Semester required!");
        return;
    }
    if(department === "") {
        alert("Department required!");
        return;
    }
    if(cgpa < 0 || cgpa > 4) {
        alert("CGPA 0-4 ke beech hona chahiye!");
        return;
    }
    if(status === "") {
        alert("Status select karo!");
        return;
    }
    
    // Sab valid hai - ab tu apna code likha
    console.log("Form valid hai!");
    studentForm.reset()
});