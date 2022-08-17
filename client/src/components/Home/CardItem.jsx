import user from '../../img/user.svg';

function CardItem() {
	return (
		<div className='flex overflow-y-hidden flex-col flex-shrink-0 text-black  w-[300px] h-[250px] rounded-md bg-white box shadow-2xl'>
			<div className='flex'>
				<div className='w-14 h-16 relative top-[20px] left-[20px] bg-pink-200 rounded-xl '>
					<img
						className='w-10 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'
						src={user}
						alt='profile-pic'
					/>
				</div>
				<div className='ml-10 mt-6 font-bold text-md text-black/90 tracking-wider'>
					<h3>AD SOYAD</h3>
				</div>
			</div>
			<div className='mt-6 mx-4 text-sm text-left'>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi debitis sunt
					eos illo hic voluptas cupiditate in dicta dolores dignissimos alias
				</p>
			</div>
		</div>
	);
}

export default CardItem;
