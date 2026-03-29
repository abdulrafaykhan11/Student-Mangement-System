let tableBody = document.getElementById("studentTableBody");

fetch("student.xml")
    .then((response) => response.text())
    .then((xmlText) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlText, "text/xml");
        let students = xmlDoc.getElementsByTagName("student");
        let rows = "";

        for (let student of students) {
            let studentId = student.getElementsByTagName("studentId")[0].textContent;
            let name = student.getElementsByTagName("name")[0].textContent;
            let age = student.getElementsByTagName("age")[0].textContent;
            let classLevel = student.getElementsByTagName("classLevel")[0].textContent;
            let department = student.getElementsByTagName("department")[0].textContent;
            let email = student.getElementsByTagName("email")[0].textContent;
            let attendance = student.getElementsByTagName("attendance")[0].textContent;
            let cgpa = student.getElementsByTagName("cgpa")[0].textContent;
            let status = student.getElementsByTagName("status")[0].textContent;

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

        tableBody.innerHTML = rows;
    });
