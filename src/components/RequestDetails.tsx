import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RequestDetails = () => {
	const { state } = useLocation();
	const requestData = state?.requestBody ?? {};

	const handleReturn = () => {
		window.history.back();
	};

	const renderRequestBody = () => {
		return (
			<pre className="font-mono text-sm bg-slate-50 p-6 rounded-md overflow-x-auto">
				{JSON.stringify(requestData, null, 2)}
			</pre>
		);
	};

	return (
		<section className="min-h-screen flex items-center justify-center py-8 px-4 bg-slate-100">
			<Card className="container max-w-3xl shadow-sm">
				<div className="p-8 space-y-6">
					<header>
						<h2 className="text-2xl font-bold text-slate-800">
							Детали запроса
						</h2>
					</header>

					<main>{renderRequestBody()}</main>

					<footer className="pt-2">
						<div className="flex justify-start">
							<Button
								type="button"
								variant="secondary"
								className="min-w-[120px]"
								onClick={handleReturn}
							>
								Вернуться
							</Button>
						</div>
					</footer>
				</div>
			</Card>
		</section>
	);
};

export default RequestDetails;
