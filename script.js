/// <reference path="jquery.js" />
$(onReady)

let employeeList = [];
let isAdmin = false;

// fortmatter for dollar values
const formatCur = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

// Begin function to append employeeList to the DOM
function appendDom() {
    $("#tableBody").empty();
    for (const employee of employeeList) {
        $("#tableBody").append(`
        <tr>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.employeeID}</td>
            <td>${employee.title}</td>
            <td>${formatCur.format(employee.annualSalary)}</td>
            <td><button class="deleteBtn">Delete</button></td>
        </tr>
        `);
    }
    let currentMonthly = calculateTotalMonthly(employeeList);
    $("#costMonthly").text(`${formatCur.format(currentMonthly)}`);

    // Apply red styling to monthly if exceeds 20,000
    if (currentMonthly > 20000) {
        $("#monthlyBackground").addClass("redBackground");
    } else {
        $("#monthlyBackground").removeClass("redBackground");
    }
    checkAdmin();
}  // end appendDom

function adminFunctions() {
    if ($("#adminBtn").hasClass("left")) {
        isAdmin = false;
        $("#adminBtn").animate({ left: "0%" }, "fast");
        setTimeout(function () {
            $("#adminBtn").removeClass("left");
            $("#adminBtnHolder").css("background-color", "white");
        }, 225);
        checkAdmin();
    } else {
        isAdmin = true;
        $("#adminBtn").animate({ left: "50%" }, "fast");
        setTimeout(function () {
            $("#adminBtn").addClass("left");
            $("#adminBtnHolder").css("background-color", "green");
        }, 225);
        checkAdmin();
    }
}  // end adminFunctions

// Begin function to calculate monthly payroll cost
function calculateTotalMonthly(array) {
    let sum = 0;
    for (const employee of array) {
        sum += Number(employee.annualSalary / 12);
    }
    return sum.toFixed(2);
}  // end calculateTotalMonthly

function checkAdmin() {
    if (isAdmin === true) {
        $(".deleteBtn").show()
    } else if (isAdmin === false) {
        $(".deleteBtn").hide()
    } else {
        console.log("Admin error, should never see this!");
    }
}  // checkAdmin

// Begin function to collect and return employee info inputs
function collectEmployeeInfo() {
    let newEmployee = {
        firstName: $("#inputFirstName").val(),
        lastName: $("#inputLastName").val(),
        employeeID: $("#inputEmployeeID").val(),
        title: $("#inputTitle").val(),
        annualSalary: $("#inputAnnualSalary").val()
    };
    return newEmployee;
}  // end collectEmployeeInfo

// Begin function to clear inputs
function clearInputs() {
    $("#inputFirstName").val("");
    $("#inputLastName").val("");
    $("#inputEmployeeID").val("");
    $("#inputTitle").val("");
    $("#inputAnnualSalary").val("");
}  // end clearInputs

// Begin function to delete employee row
function deleteEmployee(event) {
    $(event.target).closest("tr").remove();
    let eeChildID = $(event.target).closest("tr").children()[2];
    let arrayLocation = employeeList.findIndex((employee) => Number(employee.employeeID) === Number($(eeChildID).text()));
    employeeList.splice(arrayLocation, 1);
    appendDom();
}  // end deleteEmployee

// Begin function to process the addition of an employee
function processEmployeeInfo() {
    let foundID = false;
    let newEmployee = collectEmployeeInfo();
    let valueArray = Object.values(newEmployee);
    valueArray = valueArray.map((item) => {
        return item.replaceAll(" ", "");
    });

    // Checking if any input values are blank
    if (valueArray.includes("")) {
        console.log("Please enter all Inputs");
        return;
    }

    // Checking if the employee ID is already in use
    for (let i = 0; i < employeeList.length; i++) {
        const currentEmployee = employeeList[i];
        if (currentEmployee.employeeID === newEmployee.employeeID) {
            foundID = true;
        }
    }

    // If empoyee ID is NOT in use process with addition of employee
    if (foundID === false) {
        employeeList.push(collectEmployeeInfo());
        clearInputs();
        appendDom();
    } else {
        // If employee ID is in use, clear iput and log error
        clearInputs();
        console.log("EmployeeID already in use!");
    }
}  // end processEmployeeInfo

// Begin function to attach event handlers
function eventHandlers() {
    $("#addEmployeeBtn").on("click", processEmployeeInfo);
    $("html").on("keypress", (event) => {
        if (event.which === 13) {
            $("#inputFirstName").focus();
            return processEmployeeInfo();
        }
    });
    $("#tableBody").on("click", ".deleteBtn", deleteEmployee);
    $("#adminBtn").on("click", adminFunctions);
}  // end eventHandlers

// jQuery onReady
function onReady() {
    eventHandlers()
}  // end onReady