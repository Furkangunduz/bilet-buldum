function popUp({ popupContent }) {
	return (
		<div className='popup'>
			<h4>{popupContent.title}</h4>
			<p>{popupContent.text}</p>
		</div>
	);
}

export default popUp;
