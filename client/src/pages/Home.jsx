import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '20px',
			}}>
			<p>Henüz tamamlanmadı . . .</p>
			<p>Arama yapmak için :</p>
			<Link to='/search'>
				<button
					style={{
						padding: '20px 30px',
						backgroundColor: 'purple',
						color: 'white',
						borderRadius: '10px',
						cursor: 'pointer',
					}}>
					Arama yap
				</button>
			</Link>
		</div>
	);
};

export default Home;
