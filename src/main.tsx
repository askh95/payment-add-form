import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PaymentForm from "./components/PaymentForm";
import RequestDetails from "./components/RequestDetails";
import App from "./App";

import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				element: <PaymentForm />,
			},
			{
				path: "request-details",
				element: <RequestDetails />,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
