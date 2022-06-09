const Select = ({ direction, setSearchData }) => {
	return (
		<div>
			<label htmlFor={direction}>{direction}</label>
			<select id={direction} required>
				<option value='İzmit'>İzmit</option>
				<option value='Ankara'>Ankara</option>
			</select>
		</div>
	);
};

export default Select;
