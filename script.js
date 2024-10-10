// Helper function to calculate hours worked
function calculateHours(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return (isNaN(start) || isNaN(end)) ? 0 : (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
}

// Helper function to format time (HH:MM AM/PM)
function formatTime(timeStr) {
    const date = new Date(`1970-01-01T${timeStr}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Function to populate the schedule table based on actual dates
function generateScheduleTable() {
    const scheduleTableBody = document.querySelector('#scheduleTable tbody');
    scheduleTableBody.innerHTML = ''; // Clear existing content

    const totalHoursMap = {}; // Track total hours per employee

    // Populate availability data
    availabilityData.forEach(availability => {
        const { employee_id, date, start_time, end_time } = availability;
        if (!totalHoursMap[employee_id]) totalHoursMap[employee_id] = 0; // Initialize hours for new employees

        let row = scheduleTableBody.querySelector(`[data-employee-id="${employee_id}"]`);
        if (!row) {
            row = createEmployeeRow(employee_id);
            scheduleTableBody.appendChild(row);
        }

        const dayIndex = dates.indexOf(date) + 1; // Match exact date
        const dayCell = row.children[dayIndex];
        const hoursWorked = calculateHours(start_time, end_time);

        // Check if the employee has time off for this specific date
        if (!isTimeOff(employee_id, date)) {
            dayCell.textContent = `${formatTime(start_time)} - ${formatTime(end_time)}`;
            totalHoursMap[employee_id] += hoursWorked; // Add hours worked to total hours
        }

        // Update total hours display for employee
        updateTotalHours(row, totalHoursMap[employee_id]);
    });

    // Handle time-off requests
    handleTimeOffRequests(scheduleTableBody);
}

// Create employee row if not already present
function createEmployeeRow(employeeId) {
    const row = document.createElement('tr');
    row.setAttribute('data-employee-id', employeeId);

    const nameCell = document.createElement('td');
    nameCell.textContent = getEmployeeName(employeeId);
    row.appendChild(nameCell);

    // Add a cell for each date
    dates.forEach(() => row.appendChild(document.createElement('td')));

    const totalHoursCell = document.createElement('td');
    totalHoursCell.classList.add('total-hours');
    totalHoursCell.textContent = '0';
    row.appendChild(totalHoursCell);

    return row;
}

// Update total hours for each employee
function updateTotalHours(row, hours) {
    const totalHoursCell = row.querySelector('.total-hours');
    totalHoursCell.textContent = hours.toFixed(2); // Format to two decimal places
}

// Handle time-off requests by marking cells
function handleTimeOffRequests(scheduleTableBody) {
    timeOffRequests.forEach(({ employee_id, start_date, end_date, reason }) => {
        const employeeRow = scheduleTableBody.querySelector(`[data-employee-id="${employee_id}"]`);
        if (!employeeRow) return;

        let currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        while (currentDate <= endDate) {
            const currentDateString = currentDate.toISOString().split('T')[0];
            const dayIndex = dates.indexOf(currentDateString) + 1;
            const dayCell = employeeRow.children[dayIndex];

            if (dayCell) {
                dayCell.innerHTML = `<span class="time-off">Time Off (${reason})</span>`;
                dayCell.classList.add('time-off');
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });
}

// Check if the employee has time off on a specific date
function isTimeOff(employeeId, date) {
    return timeOffRequests.some(({ employee_id, start_date, end_date }) => {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const currentDate = new Date(date);
        return employee_id === employeeId && currentDate >= startDate && currentDate <= endDate;
    });
}

// Get employee name based on their ID
function getEmployeeName(employee_id) {
    const employee = employeeData.find(emp => emp.employee_id === employee_id);
    return employee ? employee.employee_name : "Unknown Employee";
}

// Populate date row in the schedule table with correct start date (Monday)
function populateDateRow() {
    const scheduleDateRow = document.querySelector('#scheduleDateRow');
    scheduleDateRow.innerHTML = ''; // Clear any existing content

    const nameCell = document.createElement('th');
    nameCell.textContent = 'Date';
    scheduleDateRow.appendChild(nameCell);

    // Dynamically generate dates starting from Monday, October 7th, 2024
    const startDate = new Date('2024-10-07'); // Starting from the correct Monday (October 7th)
    const daysInWeek = 7;

    for (let i = 0; i < daysInWeek; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i); // Increment by i days
        dates[i] = currentDate.toISOString().split('T')[0]; // Store formatted date in dates array

        const dateCell = document.createElement('th');
        dateCell.textContent = dates[i];
        scheduleDateRow.appendChild(dateCell);
    }

    const emptyCell = document.createElement('th');
    emptyCell.style.backgroundColor = 'white'; // Leave top-right corner white
    scheduleDateRow.appendChild(emptyCell);
}

// Initialize table after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateDateRow();
    generateScheduleTable();
});
