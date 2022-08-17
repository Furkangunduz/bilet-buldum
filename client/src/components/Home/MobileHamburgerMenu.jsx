import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function MobileHamburgerMenu() {
	const navigate = useNavigate();
	const [showBody, setShowBody] = useState(false);

	return (
		<div className='md:hidden flex items-center'>
			<button
				onClick={() => setShowBody((prev) => !prev)}
				className='outline-none mobile-menu-button'>
				<svg
					className='w-6 h-6 text-gray-500'
					x-show='!showMenu'
					fill='none'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path d='M4 6h16M4 12h16M4 18h16'></path>
				</svg>
			</button>

			{showBody && (
				<div className='mobile-menu'>
					<div className='relative'>
						<ul className=' flex flex-col gap-y-2 w-[100px] absolute top-full right-0 bg-gray-100/40  rounded-sm translate-y-2'>
							<li
								onClick={() => {
									navigate('/');
								}}
								className=' text-xs text-black  font-semibold  transition-all px-3 py-1'>
								HOME
							</li>
							<li
								onClick={() => {
									window.location.href =
										'https://github.com/Furkangunduz/Bilet-Buldum';
								}}
								className='text-xs text-black  font-semibold  transition-all px-3 py-1'>
								ABOUT
							</li>
							<li
								onClick={() => {
									navigate('/contact');
								}}
								className='text-xs text-black  font-semibold  transition-all px-3 py-1'>
								CONTACT
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}

export default MobileHamburgerMenu;
