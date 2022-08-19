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
				<option value='İzmit YHT'>İzmit</option>
				<option value='Ankara Gar'>Ankara</option>
				<option value='Eskişehir'>Eskişehir</option>
				<option value='İstanbul(Halkalı)'>İstanbul(Halkalı)</option>
				<option value='İstanbul(Söğütlü Ç.)'>İstanbul(Söğütlü Ç.)</option>
			</select>
		</div>
	);
};

export default Select;
