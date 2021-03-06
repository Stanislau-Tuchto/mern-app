import React, { Component} from 'react';
import { Link } from 'react-router-dom';


class Landing extends Component {

	render() {
		return (
			<main className="landing">
				<div className="dark-overlay landing-inner text-light">
					<div className="container">
						<div className="row">
							<div className="col-md-12 text-center">
								<h1 className="display-3 mb-4">Developer Social NetWork
								</h1>
								<p className="lead"> Create profile / share posts / get help</p>
								<hr className="bg-light"/>
								<Link to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
								<Link to="/login" className="btn btn-lg btn-light">Login</Link>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}

export default Landing;