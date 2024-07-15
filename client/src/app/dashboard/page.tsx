import Expense from '@/components/Expense';
import Panel from '@/components/Panel';

export default function DashboardPage() {
    return (
        <div className="page">
            <h1 className="page__title">Dashboard</h1>
            <main className="page__content">
                <Panel>
                    <Expense />
                </Panel>
                <Panel>
                    <Expense />
                </Panel>
                <Panel>
                    <Expense />
                </Panel>
            </main>
        </div>
    );
}
