import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";

import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Landing from "./pages/Landing/Landing";
import AccommodationDetail from "./pages/AccommodationDetail/AccommodationDetail";

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Routes>
					<Route index element={<Landing />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="accommodation">
						<Route path="detail/:aid" element={<AccommodationDetail />} /> {/* aid: Accommodation id */}
					</Route>
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
