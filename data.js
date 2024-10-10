console.log("data.js is loaded!");

// Availability data for employees, now including employee_name for easier reference
const availabilityData = [
    {"end_time": "17:00:00.000000", "start_time": "09:00:00.000000", "day_of_week": "Monday", "employee_id": 1, "employee_name": "Alice Johnson"},
    {"end_time": "17:00:00.000000", "start_time": "09:00:00.000000", "day_of_week": "Wednesday", "employee_id": 1, "employee_name": "Alice Johnson"},
    {"end_time": "13:00:00.000000", "start_time": "09:00:00.000000", "day_of_week": "Friday", "employee_id": 1, "employee_name": "Alice Johnson"},
    {"end_time": "15:00:00.000000", "start_time": "10:00:00.000000", "day_of_week": "Tuesday", "employee_id": 2, "employee_name": "Bob Smith"},
    {"end_time": "18:00:00.000000", "start_time": "12:00:00.000000", "day_of_week": "Thursday", "employee_id": 2, "employee_name": "Bob Smith"},
    {"end_time": "13:00:00.000000", "start_time": "09:00:00.000000", "day_of_week": "Saturday", "employee_id": 2, "employee_name": "Bob Smith"},
    {"end_time": "18:00:00.000000", "start_time": "12:00:00.000000", "day_of_week": "Thursday", "employee_id": 3, "employee_name": "Charlie Evans"},
    {"end_time": "12:00:00.000000", "start_time": "08:00:00.000000", "day_of_week": "Monday", "employee_id": 3, "employee_name": "Charlie Evans"},
    {"end_time": "16:00:00.000000", "start_time": "10:00:00.000000", "day_of_week": "Sunday", "employee_id": 3, "employee_name": "Charlie Evans"},
    {"end_time": "17:00:00.000000", "start_time": "13:00:00.000000", "day_of_week": "Wednesday", "employee_id": 4, "employee_name": "Richard Brown"},
    {"end_time": "17:00:00.000000", "start_time": "09:00:00.000000", "day_of_week": "Friday", "employee_id": 4, "employee_name": "Richard Brown"},
    {"end_time": "18:00:00.000000", "start_time": "14:00:00.000000", "day_of_week": "Tuesday", "employee_id": 5, "employee_name": "Emma Taylor"},
    {"end_time": "17:00:00.000000", "start_time": "09:00:00.000000", "day_of_week": "Thursday", "employee_id": 5, "employee_name": "Emma Taylor"},
    {"end_time": "16:00:00.000000", "start_time": "10:00:00.000000", "day_of_week": "Saturday", "employee_id": 5, "employee_name": "Emma Taylor"}
];

console.log("Availability data:", availabilityData);

// Time-off requests data
const timeOffRequests = [
    {"employee_id": 1, "employee_name": "Alice Johnson", "start_date": "2024-10-08", "end_date": "2024-10-09", "reason": "Vacation"},
    {"employee_id": 2, "employee_name": "Bob Smith", "start_date": "2024-10-11", "end_date": "2024-10-12", "reason": "Medical"},
    {"employee_id": 3, "employee_name": "Charlie Evans", "start_date": "2024-10-10", "end_date": "2024-10-10", "reason": "Personal"},
    {"employee_id": 4, "employee_name": "Richard Brown", "start_date": "2024-10-09", "end_date": "2024-10-11", "reason": "Conference"},
    {"employee_id": 5, "employee_name": "Emma Taylor", "start_date": "2024-10-07", "end_date": "2024-10-07", "reason": "Sick Leave"}
];

// Days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Dynamically generating dates based on the current week
const dates = [];
const today = new Date();
const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Start from Monday
for (let i = 0; i < 7; i++) {
    const current = new Date(firstDayOfWeek);
    current.setDate(firstDayOfWeek.getDate() + i);
    dates.push(current.toISOString().split('T')[0]); // Format as YYYY-MM-DD
}

console.log("Week Dates:", dates);

// Customer forecast data for each day of the week
const dailyCustomerForecast = {
    'Monday': [8, 12, 15, 10, 18, 20, 22, 19, 15, 10, 8, 5],
    'Tuesday': [7, 13, 14, 11, 19, 21, 23, 20, 14, 9, 6, 4],
    'Wednesday': [6, 11, 13, 9, 17, 19, 20, 18, 13, 8, 7, 3],
    'Thursday': [5, 10, 12, 8, 16, 18, 21, 20, 16, 11, 9, 2],
    'Friday': [9, 14, 16, 12, 20, 23, 25, 22, 17, 12, 10, 6],
    'Saturday': [10, 16, 18, 15, 22, 25, 27, 24, 19, 15, 12, 8],
    'Sunday': [5, 8, 10, 7, 12, 14, 16, 15, 11, 9, 7, 4]
};



const overtimeVolunteers = [
    { "employee_id": 1, "employee_name": "Alice Johnson" },
    { "employee_id": 2, "employee_name": "Bob Smith" },
    { "employee_id": 3, "employee_name": "Charlie Evans" },
    { "employee_id": 4, "employee_name": "Richard Brown" },
    { "employee_id": 5, "employee_name": "Emma Taylor" }
];


// Employee data
const employeeData = [
    {
        employee_id: 1,
        employee_name: "Alice Johnson",
        address: "123 Main St, Cityville",
        phone: "555-1234",
        email: "alice.johnson@example.com",
        department: "IT",
        skill_level: "Expert",
        job_title: "Software Engineer"
    },
    {
        employee_id: 2,
        employee_name: "Bob Smith",
        address: "456 Oak St, Townsville",
        phone: "555-5678",
        email: "bob.smith@example.com",
        department: "HR",
        skill_level: "Intermediate",
        job_title: "HR Manager"
    },
    {
        employee_id: 3,
        employee_name: "Charlie Evans",
        address: "789 Pine St, Villagetown",
        phone: "555-9876",
        email: "charlie.evans@example.com",
        department: "Marketing",
        skill_level: "Beginner",
        job_title: "Marketing Specialist"
    },
    {
        employee_id: 4,
        employee_name: "Richard Brown",
        address: "321 Maple St, Smalltown",
        phone: "555-5432",
        email: "richard.brown@example.com",
        department: "Finance",
        skill_level: "Advanced",
        job_title: "Financial Analyst"
    },
    {
        employee_id: 5,
        employee_name: "Emma Taylor",
        address: "654 Birch St, Metropolis",
        phone: "555-6543",
        email: "emma.taylor@example.com",
        department: "IT",
        skill_level: "Expert",
        job_title: "DevOps Engineer"
    }
];
