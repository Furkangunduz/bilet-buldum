import user from '../../img/user.svg';

function CardItem({ comment }) {
	return (
		<div className='flex overflow-y-hidden flex-col flex-shrink-0 text-black  md:w-[300px] md:h-[250px] xs:w-[250px] xs:h-[220px]  rounded-md bg-white box shadow-2xl'>
			<div className='flex'>
				<div className='md:w-14 md:h-16 xs:w-8 xs:h-10 relative top-[20px] left-[20px] bg-pink-200 rounded-xl '>
					<img
						className='w-10 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
						src={user}
						alt='profile-pic'
					/>
				</div>
				<div className='ml-6 mt-6 font-bold text-md text-black/90 tracking-wider'>
					<h3>{comment.name}</h3>
				</div>
			</div>
			<div className='mt-8 mx-4 text-xs text-left'>
				<p>{comment.text}</p>
			</div>
		</div>
	);
}

export default CardItem;
