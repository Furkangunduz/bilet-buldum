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

function Search() {
	const api_url = process.env.REACT_APP_API_URL;
	const history = useNavigate();
	const [searchData, setSearchData] = useState({
		'from': '',
		'to': '',
		'date': '',
		'toMail': '',
		'amount': '1',
	});

	const HasSearchDataEmptySpot = () => {
		if (
			searchData.from === '' ||
			searchData.to === '' ||
			searchData.date === '' ||
			searchData.toMail === ''
		) {
			return true;
		}

		return false;
	};

	const createRequest = () => {
		axios.post(api_url, {
			...searchData,
			date: formatDateDashToDot(searchData.date),
		})
			.then((res) => {
				if (res.data.code === 0) {
					toast.error(
						'Başka bir arama yapmak istiyorsanız lütfen diğer aramanızı iptal edin.',
						{ toastId: 2 }
					);
				} else {
					toast.success('Bilet bulduğumda size mail yoluyla ulaşacağım.', {
						toastId: 1,
					});
				}
			})
			.catch(() => {
				toast.error('Bir şeyler ters gitti.');
				console.log('Başarısız işlem');
			});
	};

	const onSubmit = (e) => {
		e.preventDefault();
		let searchDate = new Date(formatDateyyyymmdd(searchData.date));
		//check empty
		if (HasSearchDataEmptySpot()) {
			toast.error('Lütfen tüm alanları doldurunuz.', { toastId: 3 });
			return;
		}
		//check from ,to
		if (searchData.from === searchData.to) {
			toast.error('Lütfen farklı şehirler seçiniz.', { toastId: 4 });
			return;
		}
		//check date
		if (formatDateObj(searchDate) < formatDateObj(new Date())) {
			toast.error('Lütfen ileri bir tarih seçiniz.', { toastId: 5 });
			return;
		}
		//check hours
		if (formatDateObj(searchDate) === formatDateObj(new Date())) {
			if (new Date().getHours() >= 22.5) {
				toast.error("Tcdd seferleri akşam 9'dan sonra yapılmamaktadır.", {
					toastId: 6,
				});
				return;
			}
		}
		if (searchData.amount === '') {
			toast.error('Lütfen kaç kişi için bilet aradığınızı yazınız.', { toastId: 7 });
			return;
		}
		if (searchData.amount > 3 || searchData.amount <= 0) {
			toast.error('En az 1, en fazla 3 kişi için bilet arayabilirsiniz. ', { toastId: 9 });
			return;
		}
		if (validateEmail(searchData.toMail) === false) {
			toast.error('Lütfen geçerli bir mail adresi giriniz.', { toastId: 8 });
			return;
		}
		createRequest();
	};

	return (
		<>
			<button onClick={() => history(-1)} className='absolute left-10'>
				<IoArrowBackCircleSharp size={44} />
			</button>
			<div className='bg-gray-200 bg-opacity-90 text-black font-semibold rounded-md shadow-2xl  max-w-lg mx-auto mt-8 px-5 py-12 md:mt-100px'>
				<form className='flex justify-center items-center flex-col '>
					<h3 className='pb-5'>Tren Bileti Ara</h3>
					<div>
						<label htmlFor='date'>Tarih : </label>
						<input
							type='date'
							id='date'
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
					<div className='mt-6 flex gap-x-6'>
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
					<div className='mt-6'>
						<label htmlFor='amount'>Kişi sayısı : </label>
						<input
							onChange={(input) => {
								setSearchData({
									...searchData,
									amount: input.target.value,
								});
							}}
							className='w-12'
							id='amount'
							type='number'
							max='4'
							min='1'
							defaultValue='0'
						/>
					</div>
					<div className='mt-5 flex flex-col min-w-[300px]'>
						<label htmlFor='email'> Mailiniz :</label>
						<input
							onChange={(input) => {
								setSearchData({
									...searchData,
									toMail: input.target.value,
								});
							}}
							type='email'
							id='email'
							name='email'
							required
						/>
					</div>
					<button
						className='mt-6 px-3 py-1 bg-primary bg-opacity-70 text-white text-opacity-90 cursor-pointer rounded-sm'
						onClick={onSubmit}
						type='submit'>
						Ara
					</button>
				</form>
			</div>
		</>
	);
}

export default Search;
