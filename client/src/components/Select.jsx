const Select = ({ direction, passData }) => {
	return (
		<div>
			<label htmlFor={direction}>{direction}:</label>
			<select
				onChange={(e) => {
					passData(e.target.value);
				}}
				id={direction}
				required>
				<option value='' defaultChecked></option>
				<option value='İzmit'>İzmit</option>
				<option value='Ankara'>Ankara</option>
			</select>
		</div>
	);
};

export default Select;
