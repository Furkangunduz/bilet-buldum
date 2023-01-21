const Select = ({ direction, passData }) => {
	return (
		<div className='flex items-left flex-col bg-red'>
			<select
				className=' text-black w-[100%] text-sm rounded-md p-1.5 placeholder:text-slate-400 '
				placeholder='Şehir seçiniz.'
				onChange={(e) => {
					passData(e.target.value);
				}}
				id={direction}
				required>
				<option value='' className='uppercase' defaultChecked hidden>
					{direction}
				</option>
				<option value='İzmit YHT'>İzmit YHT</option>
				<option value='Ankara Gar'>Ankara Gar</option>
				<option value='Eskişehir'>Eskişehir</option>
				<option value='İstanbul(Halkalı)'>İstanbul(Halkalı)</option>
				<option value='İstanbul(Söğütlü Ç.)'>İstanbul(Söğütlü Ç.)</option>
			</select>
		</div>
	);
};

export default Select;
