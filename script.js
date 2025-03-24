let jsonData = [];  
let filteredData = []; 
let chartInstance = null;
let therapeuticChartInstance = null; 

// Fetching JSON data
async function fetchData() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        jsonData = data.en;
        filteredData = [...jsonData]; 
        displayData(filteredData);
        updateChart();
        updateBarChart(); 
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Displaying Data in Table
function displayData(data) {
    const container = document.getElementById("dataContainer");
    container.innerHTML = "";
    data.forEach(item => {
        container.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td><a href="${item.url}" target="_blank">${item.title}</a></td>
                <td>${item.therapeuticArea}</td>
                <td>${item.responseTeam}</td>
                <td>${item.startDate}</td>
                <td>${item.projectedCompletion}</td>
                <td>${item.status}</td>
            </tr>
        `;
    });
}

// Search Function
function searchData() {
    let query = document.getElementById("search").value.toLowerCase();
    filteredData = jsonData.filter(item => item.title.toLowerCase().includes(query));
    displayData(filteredData);
}

// Filtering by Status
function filterData() {
    let status = document.getElementById("filterStatus").value;
    filteredData = status ? jsonData.filter(item => item.status === status) : [...jsonData];
    displayData(filteredData);
}

// Sorting by Date
function sortData() {
    filteredData.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    displayData(filteredData);
}

// Generate Pie Chart
function updateChart() {
    // Count Completed & Active Researches
    let completed = jsonData.filter(item => item.status === "Complete").length;
    let active = jsonData.filter(item => item.status !== "Complete").length;

    // Get chart canvas
    let ctx = document.getElementById("statusChart").getContext("2d");

    // Destroy previous chart instance if exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create new chart
    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Completed", "Active"],
            datasets: [{
                data: [completed, active],
                backgroundColor: ["#8FC8E5", "#F0B487"]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function updateBarChart() {
    let counts = {};
    
    // Count occurrences of each therapeutic area
    jsonData.forEach(item => {
        counts[item.therapeuticArea] = (counts[item.therapeuticArea] || 0) + 1;
    });

    let labels = Object.keys(counts);
    let values = Object.values(counts);

    let ctx = document.getElementById("therapeuticChart").getContext("2d");

    // Destroy previous chart if exists
    if (therapeuticChartInstance) {
        therapeuticChartInstance.destroy();
    }

    // Create new bar chart
    therapeuticChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Number of Research Studies",
                data: values,
                backgroundColor: "#8FC8E5"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", fetchData);
