console.log("breaks.js is loaded!");

// Function to calculate breaks and meal periods based on shift length
function calculateBreaks(employeeId, day, startTime, endTime) {
    const breaks = [];
    const shiftLength = calculateHours(startTime, endTime);

    // Calculate break times based on shift length
    if (shiftLength >= 4 && shiftLength < 5) {
        // Shifts of 4 to less than 5 hours get one 15-minute break
        breaks.push({
            type: 'break',
            start: addHours(startTime, 2),
            duration: 15
        });
    } else if (shiftLength >= 5 && shiftLength < 7) {
        // Shifts between 5 to less than 7 hours get one 15-minute break and one 30-minute meal period
        breaks.push({
            type: 'break',
            start: addHours(startTime, 2),
            duration: 15
        });
        breaks.push({
            type: 'meal',
            start: addHours(startTime, shiftLength / 2),
            duration: 30
        });
    } else if (shiftLength >= 7 && shiftLength <= 8.5) {
        // Shifts between 7 to 8.5 hours get two 15-minute breaks and one 30-minute meal period
        breaks.push({
            type: 'break',
            start: addHours(startTime, 2),
            duration: 15
        });
        breaks.push({
            type: 'meal',
            start: addHours(startTime, shiftLength / 2),
            duration: 30
        });
        breaks.push({
            type: 'break',
            start: addHours(endTime, -2),
            duration: 15
        });
    } else if (shiftLength > 8.5) {
        // Shifts over 9 hours get two 15-minute breaks and one 1-hour meal period
        breaks.push({
            type: 'break',
            start: addHours(startTime, 2),
            duration: 15
        });
        breaks.push({
            type: 'meal',
            start: addHours(startTime, shiftLength / 2),
            duration: 60
        });
        breaks.push({
            type: 'break',
            start: addHours(endTime, -2),
            duration: 15
        });
    }

    // Ensure no breaks overlap with time off
    return breaks.filter(breakItem => !isTimeOff(employeeId, day));
}

// Helper function to add hours to a time string (HH:MM format)
function addHours(time, hoursToAdd) {
    const timeParts = time.split(':');
    let hours = parseInt(timeParts[0], 10) + hoursToAdd;
    const minutes = parseInt(timeParts[1], 10);
    
    if (hours >= 24) hours -= 24; // Wrap around for times over 24 hours
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Function to generate the breaks table
function generateBreaksTable() {
    const breaksTableBody = document.querySelector('#breaksTable tbody');
    const breaksTableHeader = document.querySelector('#breaksDateRow');
    breaksTableBody.innerHTML = ''; // Clear existing content
    breaksTableHeader.innerHTML = ''; // Clear existing header content

    // First blank cell at the top-left corner
    const blankHeader = document.createElement('th');
    blankHeader.textContent = "";  // Blank top-left corner
    breaksTableHeader.appendChild(blankHeader);

    // Add each date without the day of the week, leaving the rightmost header blank
    dates.forEach(date => {
        const dateHeader = document.createElement('th');
        dateHeader.textContent = `${date}`;  // Only display the date
        breaksTableHeader.appendChild(dateHeader);
    });

    // Second blank cell at the top-right corner
    const blankTotalHeader = document.createElement('th');
    blankTotalHeader.textContent = "";  // Blank top-right corner
    breaksTableHeader.appendChild(blankTotalHeader);

    // Populate breaks data for each employee
    employeeData.forEach(employee => {
        let row = createBreaksRow(employee.employee_id);
        breaksTableBody.appendChild(row);

        availabilityData.forEach(availability => {
            if (availability.employee_id === employee.employee_id) {
                const { date, start_time, end_time } = availability;
                const dayIndex = dates.indexOf(date) + 1;
                const dayCell = row.children[dayIndex];

                // Get the calculated breaks for this employee
                const breaks = calculateBreaks(employee.employee_id, date, start_time, end_time);
                const breakDescriptions = breaks.map(b => {
                    return `<span class="${b.type}">${b.type === 'meal' ? 'Meal' : 'Break'}: ${b.duration} mins at ${b.start}</span>`;
                }).join(', ');

                dayCell.innerHTML = breakDescriptions; // Use innerHTML to apply styles
            }
        });

        // Update total meal period time for the week
        const totalMealTime = availabilityData
            .filter(a => a.employee_id === employee.employee_id)
            .reduce((total, a) => {
                const breaks = calculateBreaks(a.employee_id, a.date, a.start_time, a.end_time);
                return total + breaks.filter(b => b.type === 'meal').reduce((sum, meal) => sum + meal.duration, 0);
            }, 0);
        updateTotalMealPeriod(row, totalMealTime);
    });
}

// Create employee row for the breaks table
function createBreaksRow(employeeId) {
    const row = document.createElement('tr');
    row.setAttribute('data-employee-id', employeeId);

    const nameCell = document.createElement('td');
    nameCell.textContent = getEmployeeName(employeeId);
    row.appendChild(nameCell);

    // Add a cell for each date
    dates.forEach(() => row.appendChild(document.createElement('td')));

    const totalMealPeriodCell = document.createElement('td');
    totalMealPeriodCell.classList.add('total-meal-period');
    totalMealPeriodCell.textContent = '0';
    row.appendChild(totalMealPeriodCell);

    return row;
}

// Update total meal period time for the week
function updateTotalMealPeriod(row, totalMealTime) {
    const totalMealPeriodCell = row.querySelector('.total-meal-period');
    totalMealPeriodCell.textContent = `${totalMealTime} mins`; // Display in minutes
}

// Initialize the breaks table after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateBreaksTable();
});
