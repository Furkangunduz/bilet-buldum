import logo from '../../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import MobileHamburgerMenu from './MobileHamburgerMenu';

function Header() {
	const navigate = useNavigate();
	const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

	return (
		<header className='flex xs:justify-between xs:px-1 md:justify-around items-center w-full '>
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
			{!isMobile ? (
				<nav>
					<ul className='flex gap-x-16'>
						<li
							onClick={() => {
								navigate('/');
							}}
							className='xl:tracking-widest xl:text-sm sm:text-xs text-white text-opacity-70 font-semibold cursor-pointer hover:scale-[1.09] hover:text-white hover:underline transition-all'>
							HOME
						</li>
						<li
							onClick={() => {
								window.location.href =
									'https://github.com/Furkangunduz/Bilet-Buldum';
							}}
							className='xl:tracking-widest xl:text-sm sm:text-xs text-white text-opacity-70 font-semibold cursor-pointer hover:scale-[1.09] hover:text-white hover:underline transition-all'>
							ABOUT
						</li>
						<li
							onClick={() => {
								navigate('/contact');
							}}
							className='xl:tracking-widest xl:text-sm sm:text-xs text-white text-opacity-70 font-semibold cursor-pointer hover:scale-[1.09] hover:text-white hover:underline transition-all'>
							CONTACT
						</li>
					</ul>
				</nav>
			) : (
				<MobileHamburgerMenu />
			)}
		</header>
	);
}

export default Header;
