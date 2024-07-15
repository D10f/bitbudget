import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="navbar">
            <menu>
                <li>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link href="/wallets">Wallets</Link>
                </li>
                <li>
                    <Link href="/profile">Profile</Link>
                </li>
            </menu>
        </nav>
    );
}
