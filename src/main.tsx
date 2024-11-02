import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import App from "./App";
import PaymentForm from "./components/PaymentForm";
import RequestDetails from "./components/RequestDetails";

import "./index.css";

const RootWrapper = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/payment-form" element={<App />}>
					<Route index element={<PaymentForm />} />
					<Route path="request-details" element={<RequestDetails />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

const mountPoint = document.getElementById("root");
if (!mountPoint) {
	throw new Error("Root element not found in document");
}

const rootInstance = createRoot(mountPoint);

rootInstance.render(<RootWrapper />);
