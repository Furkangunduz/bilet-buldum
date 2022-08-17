const Select = ({ direction, passData }) => {
	return (
		<div className='flex items-left flex-col mr-5 bg-red'>
			<label>{direction}</label>
			<select
				className='text-black text-sm rounded-md p-1.5  '
				placeholder='Şehir seçiniz.'
				onChange={(e) => {
					passData(e.target.value);
				}}
				id={direction}
				required>
				<option value='' defaultChecked></option>
				<option value='İzmit'>İzmit</option>
				<option value='Ankara'>Ankara</option>
				<option value='Eskişehir'>Eskişehir</option>
			</select>
		</div>
	);
};

export default Select;
