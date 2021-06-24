import Balance from '../components/Balance';
import Summary from '../components/Summary';
import ExpenseMonthPicker from '../components/ExpenseMonthPicker';

const Dashboard = () => {
  return (
    <>
      <Balance />
      <ExpenseMonthPicker />
      <Summary />
    </>
  );
};

export default Dashboard;
