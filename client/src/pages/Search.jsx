import { formatDateObj, formatDateStr } from '../utils/date';
import Select from '../components/Select';
import { useState } from 'react';

const Search = () => {
	const [searchData, setSearchData] = useState({
		'from': '',
		'to': '',
		'date': '',
		'toMail': '',
	});

	const onSubmit = (e) => {
		e.preventDefault();
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
					/>
				</div>
				<div className='destination'>
					<Select direction='from' setSearchData={setSearchData} />
					<Select direction='to' setSearchData={setSearchData} />
				</div>
				<button onClick={onSubmit} type='submit'>
					Ara
				</button>
			</form>
		</div>
	);
};

export default Search;
