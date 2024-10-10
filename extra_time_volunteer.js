console.log("extra_time_volunteer.js is loaded!");

// Function to get employee details by employee ID
function getEmployeeDetails(employeeId) {
    return employeeData.find(emp => emp.employee_id === employeeId) || {};
}

// Function to calculate total hours worked for each employee based on availabilityData and timeOffRequests
function calculateTotalHours(employeeId) {
    let totalHours = 0;
    
    availabilityData.forEach(shift => {
        if (shift.employee_id === employeeId) {
            // Check if the employee has booked time off on the day of the shift
            const hasTimeOff = checkTimeOff(employeeId, shift.day_of_week);
            if (!hasTimeOff) {
                const startHour = new Date(`1970-01-01T${shift.start_time}`).getHours();
                const endHour = new Date(`1970-01-01T${shift.end_time}`).getHours();
                totalHours += (endHour - startHour);
            }
        }
    });

    return totalHours;
}

// Function to check if an employee has time off on a specific day of the week
function checkTimeOff(employeeId, dayOfWeek) {
    return timeOffRequests.some(request => {
        if (request.employee_id === employeeId) {
            const startDate = new Date(request.start_date);
            const endDate = new Date(request.end_date);
            const currentDay = new Date(dates[daysOfWeek.indexOf(dayOfWeek)]);
            return currentDay >= startDate && currentDay <= endDate;
        }
        return false;
    });
}

// Function to get the days off for an employee
function getDaysOff(employeeId) {
    return timeOffRequests
        .filter(request => request.employee_id === employeeId)
        .map(request => {
            const startDate = new Date(request.start_date).toLocaleDateString();
            const endDate = new Date(request.end_date).toLocaleDateString();
            return `${startDate} to ${endDate}`;
        })
        .join(', ');
}

// Function to rank overtime volunteers based on hours worked
function rankOvertimeVolunteers() {
    const rankedVolunteers = overtimeVolunteers.map(volunteer => {
        const totalHours = calculateTotalHours(volunteer.employee_id);
        const daysOff = getDaysOff(volunteer.employee_id);
        const employeeDetails = getEmployeeDetails(volunteer.employee_id); // Fetch employee details

        return {
            employee_id: volunteer.employee_id,
            employee_name: volunteer.employee_name,
            total_hours: totalHours,
            days_off: daysOff || "None", // Default to "None" if no days off
            phone: employeeDetails.phone || "N/A" // Add phone number from employee details
        };
    });

    // Sort volunteers, prioritizing those with less than 36 hours
    rankedVolunteers.sort((a, b) => {
        if (a.total_hours < 36 && b.total_hours >= 36) {
            return -1; // Prioritize those under 36 hours
        } else if (a.total_hours >= 36 && b.total_hours < 36) {
            return 1;
        }
        return a.total_hours - b.total_hours; // Otherwise sort by total hours
    });

    return rankedVolunteers;
}

// Function to display the ranked overtime volunteers
function displayOvertimeVolunteers() {
    const rankedVolunteers = rankOvertimeVolunteers();
    const tableContainer = document.getElementById('overtimeVolunteerContainer');
    
    // Ensure there's data to display
    if (!rankedVolunteers.length) {
        tableContainer.innerHTML = "<p>No overtime volunteers available.</p>";
        return;
    }

    // Build the table for overtime volunteers
    let tableHtml = '<table><thead><tr><th>Employee Name</th><th>Phone Number</th><th>Total Hours Worked</th><th>Days Off</th></tr></thead><tbody>';

    rankedVolunteers.forEach(volunteer => {
        tableHtml += `<tr><td>${volunteer.employee_name}</td><td>${volunteer.phone}</td><td>${volunteer.total_hours}</td><td>${volunteer.days_off}</td></tr>`;
    });

    tableHtml += '</tbody></table>';
    tableContainer.innerHTML = tableHtml;
}

// Load the volunteers table after DOM is loaded
document.addEventListener('DOMContentLoaded', displayOvertimeVolunteers);
