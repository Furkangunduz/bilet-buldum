import { FaGithub, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Header() {
	return (
		<header>
			<h3>Bilet Bul</h3>
			<div className='icons'>
				<Link to='/'>
					<FaHome size={40} color='#fff' />
				</Link>
				<a href='https://github.com/Furkangunduz/TCDD_bot'>
					<FaGithub size={40} color='#fff' />
				</a>
			</div>
		</header>
	);
}

export default Header;
