console.log("forecast.js is loaded!");

// Function to calculate required employees based on customers and service time
function calculateRequiredEmployees(customers, avgServiceTime, stdDev, satisfactionRate = 0.9) {
    const serviceTimeThreshold = avgServiceTime + 2 * stdDev;
    const customersServedPerEmployee = 60 / serviceTimeThreshold;
    return Math.ceil(customers / customersServedPerEmployee);
}

// Function to calculate employee availability dynamically based on availabilityData
function calculateEmployeeAvailability(day) {
    const availability = {};

    // Iterate over availabilityData to calculate availability for each hour of the day
    availabilityData.forEach(employee => {
        if (employee.day_of_week === day) {
            const startHour = parseInt(employee.start_time.split(":")[0], 10);
            const endHour = parseInt(employee.end_time.split(":")[0], 10);
            
            // For each hour the employee is scheduled, increment the available count
            for (let hour = startHour; hour < endHour; hour++) {
                const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
                if (!availability[formattedHour]) {
                    availability[formattedHour] = 0;
                }
                availability[formattedHour] += 1;
            }
        }
    });

    return availability;
}

// Function to generate the forecast table for a specific day
function generateForecastTable(day) {
    console.log(`Generating forecast for ${day}...`);
    const forecastData = dailyCustomerForecast[day];
    const availability = calculateEmployeeAvailability(day); // Dynamically calculate employee availability

    let tableHtml = `<h3>${day} Forecast</h3><table><thead><tr><th>Hour</th><th>Customers Forecasted</th><th>Employees Available</th><th>Employees Required</th><th>Staffing Status</th></tr></thead><tbody>`;

    forecastData.forEach((customers, index) => {
        const hour = `${(9 + index).toString().padStart(2, '0')}:00`; // Hours from 09:00 to 20:00
        const availableEmployees = availability[hour] || 0; // Default to 0 if no employees are available at that hour
        const requiredEmployees = calculateRequiredEmployees(customers, 10, 2); // Average = 10, stdDev = 2

        let staffingStatus = "Balanced";
        if (availableEmployees > requiredEmployees) {
            staffingStatus = "Overstaffed";
        } else if (availableEmployees < requiredEmployees) {
            staffingStatus = "Understaffed";
        }

        tableHtml += `<tr><td>${hour}</td><td>${customers}</td><td>${availableEmployees}</td><td>${requiredEmployees}</td><td>${staffingStatus}</td></tr>`;
    });

    tableHtml += `</tbody></table>`;
    document.getElementById('forecastContainer').innerHTML += tableHtml; // Append the table to the container
}

// Generate forecast for all days of the week
document.addEventListener('DOMContentLoaded', () => {
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => generateForecastTable(day));
});
