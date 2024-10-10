console.log("breaks.js is loaded!");

// Function to calculate the break periods for each employee and total meal periods
function generateBreaksTable() {
    const breaksTableBody = document.querySelector('#breaksTable tbody');
    const breaksDateRow = document.querySelector('#breaksDateRow');
    breaksTableBody.innerHTML = ''; // Clear existing content
    breaksDateRow.innerHTML = ''; // Clear the header dates row

    // Add a blank cell for the top-left corner
    // Add "Date" to the top-left corner
    const topLeftCell = document.createElement('th');
    topLeftCell.textContent = 'Date'; // Add "Date" to the top-left cell
    topLeftCell.style.backgroundColor = 'light-grey'; // Set the background color of the top-left cell to white
    breaksDateRow.appendChild(topLeftCell);


    // Populate dates in the header for each day of the week
    dates.forEach(date => {
        const dateCell = document.createElement('th');
        dateCell.textContent = date; // Add the date
        breaksDateRow.appendChild(dateCell);
    });

    // Add a blank cell for the top-right corner (to represent "Total Meal Period Time")
    const topRightCell = document.createElement('th');
    topRightCell.style.backgroundColor = 'white'; // Make the top-right cell white (blank)
    breaksDateRow.appendChild(topRightCell);

    const mealPeriodMap = {}; // To store total meal period time per employee

    availabilityData.forEach(availability => {
        const { employee_id, start_time, end_time, day_of_week } = availability;
        const hoursWorked = calculateHours(start_time, end_time);

        // Check if employee has time off on this day
        if (hasTimeOff(employee_id, day_of_week)) {
            return; // Skip break generation if the employee has time off
        }

        if (!mealPeriodMap[employee_id]) mealPeriodMap[employee_id] = 0; // Initialize meal period count for the employee

        let row = breaksTableBody.querySelector(`[data-employee-id="${employee_id}"]`);
        if (!row) {
            row = createBreaksRow(employee_id);
            breaksTableBody.appendChild(row);
        }

        // Only add breaks if the employee is working that day
        if (hoursWorked > 0) {
            const dayIndex = daysOfWeek.indexOf(day_of_week) + 1; // +1 to skip the name cell
            const dayCell = row.children[dayIndex];

            const { breaks, mealPeriodTime } = calculateBreaks(start_time, end_time, hoursWorked); // Get breaks and meal period time
            mealPeriodMap[employee_id] += mealPeriodTime; // Add meal period time to the total

            dayCell.innerHTML = formatBreaks(breaks); // Insert formatted breaks into the table
        }
    });

    // Append total meal periods at the end of the table for each employee
    appendMealPeriodTotal(mealPeriodMap);
}

// Function to create a new row for the breaks table
function createBreaksRow(employeeId) {
    const row = document.createElement('tr');
    row.setAttribute('data-employee-id', employeeId);

    const nameCell = document.createElement('td');
    nameCell.textContent = getEmployeeName(employeeId);
    row.appendChild(nameCell);

    // Add cells for each day of the week
    daysOfWeek.forEach(() => row.appendChild(document.createElement('td')));

    // Add cell for total meal period time
    const totalMealCell = document.createElement('td');
    totalMealCell.classList.add('total-meal-period');
    totalMealCell.textContent = '0 minutes';
    row.appendChild(totalMealCell);

    return row;
}

// Function to calculate breaks and meal period for each employee
function calculateBreaks(startTime, endTime, hoursWorked) {
    const start = new Date(`1970-01-01T${startTime}`);
    const breaks = [];
    let mealPeriodTime = 0; // Track meal period time

    // First break: 2 hours after start
    const firstBreakStart = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours after start
    const firstBreakEnd = new Date(firstBreakStart.getTime() + 15 * 60 * 1000); // 15-minute break
    breaks.push({ start: firstBreakStart, end: firstBreakEnd });

    // Meal period (second break)
    if (hoursWorked >= 5 && hoursWorked < 9) {
        const mealStart = new Date(firstBreakEnd.getTime() + 2 * 60 * 60 * 1000); // 2 hours after first break
        const mealEnd = new Date(mealStart.getTime() + 30 * 60 * 1000); // 30-minute meal period
        breaks.push({ start: mealStart, end: mealEnd });
        mealPeriodTime = 30; // 30 minutes meal period
    } else if (hoursWorked >= 9) {
        const mealStart = new Date(firstBreakEnd.getTime() + 2 * 60 * 60 * 1000); // 2 hours after first break
        const mealEnd = new Date(mealStart.getTime() + 60 * 60 * 1000); // 1-hour meal period
        breaks.push({ start: mealStart, end: mealEnd });
        mealPeriodTime = 60; // 1 hour meal period
    }

    // Additional break 2 hours before end if shift is between 7 and 9 hours
    if (hoursWorked >= 6.5 && hoursWorked < 9) {
        const end = new Date(`1970-01-01T${endTime}`);
        const secondBreakStart = new Date(end.getTime() - 2 * 60 * 60 * 1000); // 2 hours before end
        const secondBreakEnd = new Date(secondBreakStart.getTime() + 15 * 60 * 1000); // 15-minute break
        breaks.push({ start: secondBreakStart, end: secondBreakEnd });
    }

    return { breaks, mealPeriodTime };
}

// Function to check if the employee has time off on the given day of the week
function hasTimeOff(employeeId, dayOfWeek) {
    return timeOffRequests.some(timeOff => {
        const startDate = new Date(timeOff.start_date);
        const endDate = new Date(timeOff.end_date);
        const currentDay = new Date(dates[daysOfWeek.indexOf(dayOfWeek)]);
        return timeOff.employee_id === employeeId && currentDay >= startDate && currentDay <= endDate;
    });
}

// Function to format breaks into a string for display
function formatBreaks(breaks) {
    return breaks.map(b => `${formatTime(b.start.toISOString().split('T')[1])} - ${formatTime(b.end.toISOString().split('T')[1])}`).join('<br>');
}

// Function to append total meal period time at the end of the week
function appendMealPeriodTotal(mealPeriodMap) {
    document.querySelectorAll('.total-meal-period').forEach(cell => {
        const employeeId = cell.parentElement.getAttribute('data-employee-id');
        const totalMealTime = mealPeriodMap[employeeId];
        cell.textContent = `${totalMealTime} minutes`;
    });
}

// Initialize breaks table when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    generateBreaksTable();
});
