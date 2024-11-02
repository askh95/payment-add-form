import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

const PRIVATE_KEY = "316b2be8-3475-4462-bd57-c7794d4bdb53";
const HASH_SECRET = "1234567890";

const processPaymentAmount = (val: string): string => {
	const clean = val.replace(/\D/g, "");
	if (!clean) return "";
	return `${new Intl.NumberFormat("ru-RU").format(parseInt(clean))} ₽`;
};

const extractNumericValue = (val: string): string => val.replace(/\D/g, "");

const checkDateValidity = (date: string): boolean => {
	if (!date) return false;
	const [month, year] = date.split("/").map((x) => parseInt(x, 10));
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear() % 100;
	const currentMonth = currentDate.getMonth() + 1;

	if (month < 1 || month > 12) return false;
	if (year < currentYear) return false;

	if (year === currentYear && month < currentMonth) {
		return false;
	}

	return true;
};

const verifyCardNumber = (num: string) => {
	let total = 0;
	let alternate = false;
	num = num.replace(/\D/g, "");

	for (let n = num.length - 1; n >= 0; n--) {
		let currentNum = parseInt(num[n]);
		if (alternate) {
			currentNum *= 2;
			if (currentNum > 9) {
				currentNum -= 9;
			}
		}
		total += currentNum;
		alternate = !alternate;
	}
	return total % 10 === 0;
};

const PaymentInterface = () => {
	const routeChange = useNavigate();

	const [paymentState, setPaymentState] = useState({
		cardNum: "",
		validThru: "",
		securityCode: "",
		paymentSum: "500 ₽",
		payerName: "",
		paymentNote: "Экскурсия",
	});

	const [validationState, setValidationState] = useState({
		cardNum: "",
		validThru: "",
		securityCode: "",
		paymentSum: "",
		payerName: "",
	});

	const formatCardInput = (raw: string) => {
		const digitsOnly = raw.replace(/\D/g, "");
		const groups = digitsOnly.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
		if (!groups) return "";

		const [, g1, g2, g3, g4] = groups;
		if (!g2) return g1;
		if (!g3) return `${g1} ${g2}`;
		if (!g4) return `${g1} ${g2} ${g3}`;
		return `${g1} ${g2} ${g3} ${g4}`;
	};

	const formatExpiryInput = (raw: string) => {
		const clean = raw.replace(/\D/g, "");
		const parts = clean.match(/(\d{0,2})(\d{0,2})/);
		if (!parts) return "";

		let [, monthPart, yearPart] = parts;
		const currentYearShort = new Date().getFullYear() % 100;

		if (monthPart.length === 1 && parseInt(monthPart) > 1) {
			monthPart = `0${monthPart}`;
		} else if (monthPart.length === 2) {
			const monthVal = parseInt(monthPart);
			if (monthVal === 0) monthPart = "01";
			if (monthVal > 12) monthPart = "12";
		}

		if (yearPart.length === 2 && parseInt(yearPart) < currentYearShort) {
			yearPart = currentYearShort.toString();
		}

		return yearPart ? `${monthPart}/${yearPart}` : monthPart;
	};

	const handleFieldUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let processedValue = value;

		switch (name) {
			case "cardNum":
				processedValue = formatCardInput(value);
				break;
			case "validThru":
				processedValue = formatExpiryInput(value);
				break;
			case "securityCode":
				processedValue = value.replace(/\D/g, "").slice(0, 3);
				break;
			case "paymentSum":
				processedValue = value === "" ? "" : processPaymentAmount(value);
				break;
		}

		setPaymentState((current) => ({
			...current,
			[name]: processedValue,
		}));

		setValidationState((current) => ({
			...current,
			[name]: "",
		}));
	};

	const validatePaymentForm = () => {
		const issues: any = {};

		if (!paymentState.cardNum) {
			issues.cardNum = "Введите номер карты";
		} else if (!verifyCardNumber(paymentState.cardNum)) {
			issues.cardNum = "Неверный номер карты";
		}

		if (!paymentState.validThru) {
			issues.validThru = "Введите срок";
		} else if (!checkDateValidity(paymentState.validThru)) {
			const [month] = paymentState.validThru.split("/");
			const currentMonth = new Date().getMonth() + 1;
			if (parseInt(month) < currentMonth) {
				issues.validThru = "Срок действия карты истек";
			} else {
				issues.validThru = "Неверный срок действия карты";
			}
		}

		if (!paymentState.securityCode) {
			issues.securityCode = "Введите CVV";
		}

		const cleanSum = extractNumericValue(paymentState.paymentSum);
		if (!cleanSum) {
			issues.paymentSum = "Введите сумму";
		} else if (parseInt(cleanSum) < 10) {
			issues.paymentSum = "Минимальная сумма 10 ₽";
		}

		if (!paymentState.payerName) {
			issues.payerName = "Введите имя";
		}

		setValidationState(issues);
		return Object.keys(issues).length === 0;
	};

	const processPayment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validatePaymentForm()) return;

		const txId = Date.now().toString();
		const cleanAmount = extractNumericValue(paymentState.paymentSum);
		const dataString = `${PRIVATE_KEY}${txId}${cleanAmount}${HASH_SECRET}`;

		const hashResult = await crypto.subtle
			.digest("SHA-256", new TextEncoder().encode(dataString))
			.then((hash) =>
				Array.from(new Uint8Array(hash))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("")
			);

		const paymentData = {
			hashsum: hashResult,
			transaction: txId,
			description: paymentState.paymentNote,
			apikey: PRIVATE_KEY,
			amount: parseInt(cleanAmount),
			custom_data: {
				initiator: "Иван К.",
				event: "Экскурсия",
			},
		};

		routeChange("./request-details", { state: { requestBody: paymentData } });
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
			<Card className="w-full max-w-lg p-8 space-y-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Иван К. собирает на «Экскурсия»
				</h2>

				<form onSubmit={processPayment} className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-600">
							Номер карты
						</label>
						<Input
							name="cardNum"
							value={paymentState.cardNum}
							onChange={handleFieldUpdate}
							className={validationState.cardNum ? "border-rose-500" : ""}
						/>
						{validationState.cardNum && (
							<p className="text-rose-500 text-sm">{validationState.cardNum}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-600">
								Срок действия
							</label>
							<Input
								name="validThru"
								value={paymentState.validThru}
								onChange={handleFieldUpdate}
								placeholder="ММ/ГГ"
								className={validationState.validThru ? "border-rose-500" : ""}
							/>
							{validationState.validThru && (
								<p className="text-rose-500 text-sm">
									{validationState.validThru}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-600">CVV</label>
							<Input
								name="securityCode"
								type="password"
								value={paymentState.securityCode}
								onChange={handleFieldUpdate}
								className={
									validationState.securityCode ? "border-rose-500" : ""
								}
							/>
							{validationState.securityCode && (
								<p className="text-rose-500 text-sm">
									{validationState.securityCode}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-600">
							Сумма перевода
						</label>
						<Input
							name="paymentSum"
							value={paymentState.paymentSum}
							onChange={handleFieldUpdate}
							placeholder="₽"
							className={validationState.paymentSum ? "border-rose-500" : ""}
						/>
						{validationState.paymentSum && (
							<p className="text-rose-500 text-sm">
								{validationState.paymentSum}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-600">
							Ваше имя
						</label>
						<Input
							name="payerName"
							value={paymentState.payerName}
							onChange={handleFieldUpdate}
							className={validationState.payerName ? "border-rose-500" : ""}
						/>
						{validationState.payerName && (
							<p className="text-rose-500 text-sm">
								{validationState.payerName}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-600">
							Сообщение получателю
						</label>
						<Input
							name="paymentNote"
							value={paymentState.paymentNote}
							onChange={handleFieldUpdate}
						/>
					</div>

					<div className="flex gap-4">
						<Button type="submit" className="flex-1">
							Перевести
						</Button>
						<Button
							type="button"
							variant="secondary"
							className="flex-1"
							onClick={() => window.history.back()}
						>
							Вернуться
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
};

export default PaymentInterface;
