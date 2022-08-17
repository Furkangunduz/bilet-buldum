import logo from '../../img/logo.png';
import { useNavigate } from 'react-router-dom';

function Header() {
	const navigate = useNavigate();
	return (
		<header className='flex justify-around items-center w-full '>
			<div className='w-[150px]'>
				<img
					onClick={() => {
						window.location.href = 'https://github.com/Furkangunduz/Bilet-Buldum';
					}}
					className='cursor-pointer'
					src={logo}
					alt='logo'
				/>
			</div>
			<nav>
				<ul className='flex gap-x-16'>
					<li
						onClick={() => {
							navigate('/');
						}}
						className='tracking-widest text-sm text-white text-opacity-70 font-semibold cursor-pointer hover:scale-[1.09] hover:text-white hover:underline transition-all'>
						HOME
					</li>
					<li
						onClick={() => {
							window.location.href =
								'https://github.com/Furkangunduz/Bilet-Buldum';
						}}
						className='tracking-widest text-sm text-white text-opacity-70 font-semibold cursor-pointer hover:scale-[1.09] hover:text-white hover:underline transition-all'>
						ABOUT
					</li>
					<li
						onClick={() => {
							navigate('/contact');
						}}
						className='tracking-widest text-sm text-white text-opacity-70 font-semibold cursor-pointer hover:scale-[1.09] hover:text-white hover:underline transition-all'>
						CONTACT
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
