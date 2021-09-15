/**
 * Performs a text-based search on an array of expenses. Initial character defines the field to run
 * a match for.
 * @param  {string} searchTerm  The search criteria
 * @param  {array}  expenseList Array of expenses to filter
 * @return {array}              A new array with the filtered expenses
 *
 * @example filterExpenses('coffe', expenseList)   // returns expenses with coffe in title or description
 * @example filterExpenses('/travel', expenseList) // returns expenses with category of travel
 * @example filterExpenses('@12', expenseList)     // returns expenses created on the 12th of the month
 * @example filterExpenses('@fri', expenseList)    // returns expenses created on a friday
 */
const useFilterExpenses = (expenseList) => {

  // An expense createdAt field looks like: Sat Jun 12 2021 05:42:51
  // We are only interested in the day of the week 'Sat' and day of month '12'.
  const createdAtRegex = new RegExp(/^(\w{3})\s\w{3}\s(\d{2})/i);

  return searchTerm => {
    // If there's no searching criteria return everything
    if (searchTerm === '') return expenseList;

    const lowerCaseTerm = searchTerm.toLowerCase();
    let filteredExpenses = [];

    // First character determines the field to look for a match
    switch (lowerCaseTerm[0]) {

      case '/': // search based on category
        return expenseList.filter(expense => (
          lowerCaseTerm.slice(1).includes(expense.category.toLowerCase())
        ));

      case '@': // search based on the day
        // Queries like "@8" should become "08" single there are not single digit days produced in regex
        const searchTermNormalized = lowerCaseTerm.slice(1).padStart(2, 0);

        return expenseList.filter(expense => {
          // Extract the relevant information (referencing the day) from the date string
          const createdAtDay = expense.createdAt
            .toLowerCase()
            .match(createdAtRegex)
            .slice(1);

          return createdAtDay.some(keyword => searchTermNormalized.startsWith(keyword));
        });

      default: // search based on title and description
        return expenseList.filter(expense => (
          expense.title.toLowerCase().includes(lowerCaseTerm.slice(1)) ||
          expense.description.toLowerCase().includes(lowerCaseTerm.slice(1))
        ));
    }
  }
};

export default useFilterExpenses;
