
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navigation">
            
            <Link className="link" to="/">Home</Link>
            <Link className="link" to="/about">About</Link>
            <Link className="link" to="/contact">Contact</Link>
            
        </nav>
    );
}

export default Navbar;