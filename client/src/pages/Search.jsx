import {
	formatDateObj,
	formatDateStr,
	formatDateyyyymmdd,
	formatDateDashToDot,
} from '../utils/date';
import { validateEmail } from '../utils/validate';
import Select from '../components/Select';
import PopUp from '../components/PopUp';
import { useState } from 'react';

const axios = require('axios');

const Search = () => {
	const [showPopUp, setshowPopUp] = useState(false);
	const [popUpContent, setpopUpContent] = useState({});
	const [searchData, setSearchData] = useState({
		'from': '',
		'to': '',
		'date': '',
		'toMail': '',
	});

	const createPopUp = ({ title, text }) => {
		setshowPopUp(true);
		setTimeout(() => {
			setshowPopUp(false);
		}, 6 * 1000);
		setpopUpContent({ title, text });
	};

	const createRequest = () => {
		createPopUp({
			title: 'Teşekkürler!',
			text: 'Bilet bulduğumda size mail yoluyla ulaşacağım.',
		});
		axios.post('http://localhost:3001/', {
			...searchData,
			date: formatDateDashToDot(searchData.date),
		})
			.then(() => {
				console.log('başarılı');
			})
			.catch(() => {
				console.log('başarısız');
			});
	};

	const onSubmit = (e) => {
		e.preventDefault();
		let searchDate = new Date(formatDateyyyymmdd(searchData.date));
		//check empty
		if (
			searchData.from === '' ||
			searchData.to === '' ||
			searchData.date === '' ||
			searchData.toMail === ''
		) {
			createPopUp({
				title: 'Eksik Alan',
				text: 'Lütfen tüm alanları doldurunuz.',
			});
			return;
		}
		//check from ,to
		if (searchData.from === searchData.to) {
			createPopUp({
				title: 'Aynı Şehir',
				text: 'Lütfen farklı şehirler seçiniz.',
			});
			return;
		}
		//check date
		if (formatDateObj(searchDate) < formatDateObj(new Date())) {
			createPopUp({
				title: 'Geçmiş Tarih',
				text: 'Lütfen ileri bir tarih seçiniz.',
			});
			return;
		}
		//check hours
		if (formatDateObj(searchDate) === formatDateObj(new Date())) {
			if (new Date().getHours() >= 22.5) {
				createPopUp({
					title: 'Geçmiş saat',
					text: "Tcdd seferleri akşam 9'dan sonra yapılmamaktadır.",
				});
				return;
			}
		}
		if (validateEmail(searchData.toMail) === false) {
			createPopUp({
				title: 'Geçersiz mail',
				text: 'Lütfen geçerli bir mail adresi giriniz.',
			});
			return;
		}
		createRequest();
	};
	return (
		<div className='container'>
			<form>
				<h3>Tren Bileti Ara</h3>
				<div className='setDate'>
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
				<div className='destination'>
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
				<div className='mail'>
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
				<button onClick={onSubmit} type='submit'>
					Ara
				</button>
			</form>
			{showPopUp && <PopUp popupContent={popUpContent} />}
		</div>
	);
};

export default Search;
