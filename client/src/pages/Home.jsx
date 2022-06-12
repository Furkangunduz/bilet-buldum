import { Link } from 'react-router-dom';
import Info from '../components/Info';

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
			<Info />
			<Link to='/TCDD_bot/search'>
				<button
					style={{
						padding: '20px 30px',
						backgroundColor: 'purple',
						color: 'white',
						borderRadius: '10px',
						cursor: 'pointer',
					}}>
					Bilet bul
				</button>
			</Link>
		</div>
	);
};

export default Home;
