console.log("employee_table.js is loaded!");

// Function to display the employee details table
function displayEmployeeTable() {
    const tableContainer = document.getElementById('employeeTableContainer');
    
    if (!employeeData.length) {
        tableContainer.innerHTML = "<p>No employee data available.</p>";
        return;
    }

    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Skill Level</th>
                    <th>Job Title</th>
                </tr>
            </thead>
            <tbody>
    `;

    employeeData.forEach(employee => {
        tableHtml += `
            <tr>
                <td>${employee.employee_name}</td>
                <td>${employee.address}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.skill_level}</td>
                <td>${employee.job_title}</td>
            </tr>
        `;
    });

    tableHtml += '</tbody></table>';
    tableContainer.innerHTML = tableHtml;
}

// Load the employee table after DOM is loaded
document.addEventListener('DOMContentLoaded', displayEmployeeTable);
