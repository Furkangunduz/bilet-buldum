import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import commentsData from '../data/comments';

import Header from '../components/Home/Header';
import CardItem from '../components/Home/CardItem';
import { Icon } from '../Icon';

function Home() {
	const navigate = useNavigate();
	const favoritesRef = useRef();
	const [prev, setPrev] = useState(false);
	const [next, setNext] = useState(false);

	useEffect(() => {
		if (favoritesRef.current) {
			const scrollHandle = () => {
				const isEnd =
					favoritesRef.current.scrollLeft + favoritesRef.current.offsetWidth ===
					favoritesRef.current.scrollWidth;
				const isBegin = favoritesRef.current.scrollLeft === 0;
				setPrev(!isBegin);
				setNext(!isEnd);
			};

			scrollHandle();
			favoritesRef.current.addEventListener('scroll', scrollHandle);

			return () => {
				favoritesRef?.current?.removeEventListener('scroll', scrollHandle);
			};
		}
	}, [favoritesRef]);

	const slideFavoritesNext = () => {
		favoritesRef.current.scrollLeft += favoritesRef.current.offsetWidth - 250;
	};
	const slideFavoritesPrev = () => {
		favoritesRef.current.scrollLeft -= favoritesRef.current.offsetWidth - 250;
	};

	return (
		<>
			<Header />
			<section className='w-full h-[300px] flex justify-center items-center '>
				<div className='flex flex-col justify-center items-center'>
					<button
						onClick={() => navigate('/search')}
						className='bg-black px-4 mb-6 xs:mt-[35px] md:mt-0 py-2 rounded bg-opacity-70 hover:bg-opacity-100  hover:scale-[1.09] transition-all'>
						Bilet Bul
					</button>
					<div className='md:mx-28 xl:mx-[500px] mt-4 text-center xs:text-sm md:text-lg font-semibold'>
						<h2>
							Bilet bulamadıysan korkma, senin için en uygun bileti arayabilir
							bulunca da seni haberdar edebilirm
						</h2>
						<p className='text-xs font-thin mt-8'>
							Acilen bilet almak istediğinde bilet bulamamanın zorluğunu
							biliyoruz. Ama korkma artık yanlız değilsin.
						</p>
					</div>
				</div>
			</section>
			<section className='flex justify-center mt-8'>
				<div className='md:w-[800px] xs:w-[350px] relative'>
					{prev && (
						<button
							className='w-12  absolute sm:-left-6 xs:left-2 hover:scale-[1.06] z-10 top-1/2 -translate-y-1/2 h-12 rounded-full xs:bg-black/20 sm:bg-black/80 xs:text-black sm:text-white flex items-center justify-center'
							onClick={slideFavoritesPrev}>
							<Icon name='prev' size={24} />
						</button>
					)}
					{next && (
						<button
							className='w-12 absolute sm:-right-6 xs:right-2 hover:scale-[1.06] z-10 top-1/2 -translate-y-1/2 h-12 rounded-full  xs:bg-black/20 sm:bg-black/80 xs:text-black sm:text-white flex items-center justify-center'
							onClick={slideFavoritesNext}>
							<Icon name='next' size={24} />
						</button>
					)}
					<ScrollContainer
						innerRef={favoritesRef}
						className='flex overflow-x gap-x-6 relative scroll-smooth'>
						{commentsData.map((comment) => (
							<CardItem comment={comment} />
						))}
					</ScrollContainer>
				</div>
			</section>
		</>
	);
}

export default Home;
