// when viewing month Y, ensures visible days in months X and Z have correct month parameters in calendar state
function findReturnMonth(month, array, date) {
    return (month < 8 && array[month] > 23)
        ? date.getMonth() === 0
            ? 11
            : date.getMonth() - 1
        : (month > 28 && array[month] < 15)
            ? date.getMonth() === 11
                ? 0
                : date.getMonth() + 1
            : date.getMonth()
}

// when viewing jan or dec, ensures visible days from prev/next year have correct month and year values
function findReturnYear(month, array, date) {
    return date.getMonth() === 0
        ? (month < 8 && array[month] > 23)
            ? date.getFullYear() - 1
            : date.getFullYear()
        : date.getMonth() === 11
            ? (month > 28 && array[month] < 15)
                ? date.getFullYear() + 1
                : date.getFullYear()
            : date.getFullYear()
}

const getDaysInMonth = (date) => { // helper function to return the number of days in a month
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
};

const formatDate = (date) => { // turn a date object into MM-DD-YYYY string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export { findReturnMonth, findReturnYear, getDaysInMonth, formatDate }