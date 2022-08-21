import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
	validateEmail,
	formatDateObj,
	formatDateStr,
	formatDateyyyymmdd,
	formatDateDashToDot,
} from '../utils';

import Select from '../components/Search/Select';
import { IoArrowBackCircleSharp } from 'react-icons/io5';

const axios = require('axios');
const api_url = process.env.REACT_APP_API_URL;

function Search() {
	const [doesSentRequest, setDoesSentRequest] = useState(false);
	const [searchData, setSearchData] = useState({
		'from': '',
		'to': '',
		'date': '',
		'mail': '',
		'amount': '1',
	});
	const history = useNavigate();

	const HasSearchDataEmptySpot = () => {
		if (
			searchData.from === '' ||
			searchData.to === '' ||
			searchData.date === '' ||
			searchData.mail === ''
		) {
			return true;
		}
		return false;
	};

	const createRequest = () => {
		setDoesSentRequest(true);
		console.log(searchData);
		axios.post(api_url + '/', {
			...searchData,
			date: formatDateDashToDot(searchData.date),
		})
			.then((res) => {
				if (res.data.code === 0) {
					toast.error(
						'Başka bir arama yapmak istiyorsanız lütfen diğer aramanızı iptal edin.',
						{ toastId: 1 }
					);
				} else if (res.data.code === 4) {
					toast.error('Server yoğunluğundan dolayı şu an arama yapılamıyor.', {
						toastId: 13,
					});
				} else {
					toast.success('Bilet bulduğumda size mail yoluyla ulaşacağım.', {
						toastId: 2,
					});
				}
			})
			.catch(() => {
				toast.error('Bir şeyler ters gitti.', { toastId: 3 });
				console.log('Başarısız işlem');
			});
	};
	const finishLastJob = (e) => {
		e.preventDefault();
		axios.post(api_url + '/finishSingleJob', {
			'mail': searchData.mail,
		})
			.then((res) => {
				if (res.data.code === 2) {
					toast.success('Aramanız başarıyla iptal edildi.', { toastId: 11 });
				} else {
					toast.error('Bu mail üzerine arama bulunmuyor.', {
						toastId: 12,
					});
				}
			})
			.catch(() => {
				toast.error('Bir şeyler ters gitti.', { toastId: 3 });
				console.log('Başarısız işlem');
			});
	};

	const onSubmit = (e) => {
		e.preventDefault();
		let searchDate = new Date(formatDateyyyymmdd(searchData.date));
		//check empty
		if (HasSearchDataEmptySpot()) {
			toast.error('Lütfen tüm alanları doldurunuz.', { toastId: 4 });
			return;
		}
		//check from ,to
		if (searchData.from === searchData.to) {
			toast.error('Lütfen farklı şehirler seçiniz.', { toastId: 5 });
			return;
		}
		//check date
		if (formatDateObj(searchDate) < formatDateObj(new Date())) {
			toast.error('Lütfen ileri bir tarih seçiniz.', { toastId: 6 });
			return;
		}
		//check hours
		if (formatDateObj(searchDate) === formatDateObj(new Date())) {
			if (new Date().getHours() >= 22.5) {
				toast.error("Tcdd seferleri akşam 9'dan sonra yapılmamaktadır.", {
					toastId: 7,
				});
				return;
			}
		}
		if (searchData.amount === '') {
			toast.error('Lütfen kaç kişi için bilet aradığınızı yazınız.', { toastId: 8 });
			return;
		}
		if (searchData.amount > 3 || searchData.amount <= 0) {
			toast.error('En az 1, en fazla 3 kişi için bilet arayabilirsiniz. ', { toastId: 9 });
			return;
		}
		if (validateEmail(searchData.mail) === false) {
			toast.error('Lütfen geçerli bir mail adresi giriniz.', { toastId: 10 });
			return;
		}
		createRequest();
	};

	return (
		<>
			<button
				onClick={() => history(-1)}
				className='absolute sm:left-10 sm:top-1 xs:left-1 sm:text-white text-primary hover:scale-[1.05] hover:-translate-y-1 transition-all '>
				<IoArrowBackCircleSharp size={44} />
			</button>
			<div className='bg-gray-200 sm:px-10 sm:pb-12 bg-opacity-90 text-black font-semibold rounded-sm shadow-2xl  max-w-lg mx-auto mt-8  sm:mt-100px'>
				<form className='flex flex-col justify-center  gap-y-2'>
					<h3 className='sm:pb-10 pb-5 sm:mt-5 hover:scale-[1.05] hover:text-black  text-black/70 cursor-pointer transition-all text-center font-bold text-xl underline underline-offset-4 '>
						Tren Bileti Ara
					</h3>
					<div className='flex justify-center items-center pr-10'>
						<input
							type='date'
							id='date'
							className='ml-5'
							onChange={(input) => {
								setSearchData({
									...searchData,
									date: formatDateStr(input.target.value),
								});
							}}
							min={formatDateObj(new Date())}
							required
						/>
					</div>
					<div className='xs:w-full xs:px-5 sm:w-full mt-6 flex justify-between  gap-x-6'>
						<Select
							direction='nereden'
							passData={(data) => {
								setSearchData({ ...searchData, from: data });
							}}
						/>
						<Select
							direction='nereye'
							passData={(data) => {
								setSearchData({ ...searchData, to: data });
							}}
						/>
					</div>
					<div className='mt-6 flex justify-center items-center pr-28'>
						<label htmlFor='amount' className='whitespace-nowrap'>
							Kişi sayısı :{' '}
						</label>
						<input
							onChange={(input) => {
								setSearchData({
									...searchData,
									amount: input.target.value,
								});
							}}
							className='ml-4 sm:ml-2 w-[30%]'
							id='amount'
							type='number'
							max='4'
							min='1'
							defaultValue='0'
						/>
					</div>
					<div className='mt-5 flex justify-center items-center mr-4 flex-col '>
						<input
							className='w-[70%]'
							onChange={(input) => {
								setSearchData({
									...searchData,
									mail: input.target.value,
								});
							}}
							placeholder='Mail adresiniz.'
							type='email'
							id='email'
							name='email'
							required
						/>
					</div>
					<button
						className='mt-6 px-3 py-1 bg-primary disabled:bg-primary/50 disabled:cursor-not-allowedor bg-opacity-70 text-white text-opacity-90 cursor-pointer rounded-sm'
						onClick={onSubmit}
						disabled={HasSearchDataEmptySpot() || doesSentRequest}
						type='submit'>
						Ara
					</button>
					<button
						className='mt-6 px-3 py-1 bg-red-500 disabled:bg-opacity-80 text-white text-opacity-90 cursor-pointer rounded-sm'
						onClick={finishLastJob}
						disabled={searchData.mail === ''}
						type='submit'>
						Geçmiş aramamı sil
					</button>
				</form>
			</div>
		</>
	);
}

export default Search;
