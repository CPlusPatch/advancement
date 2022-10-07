import { useState } from "react";
import "./App.css";
import { Input } from "@material-tailwind/react";
import validateEquation from "./validateEquation";

function App() {
	const [result, setResult] = useState({
		coeffs: [],
		a: "",
		b: "",
		c: "",
		d: "",
	});
	return (
		<div className="flex items-center justify-center h-full w-full">
			<div className="w-96 flex flex-col">
				<Input
					variant="standard"
					label="Equation"
					className="w-6"
					defaultValue={"C_7,H_16 + O_2 = C,O_2 + H_2,O"}
					onChange={function (event) {
						validateEquation(event, setResult);
					}}
					error={!result.coeffs[0]}
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5">
							<path
								fillRule="evenodd"
								d="M8.5 3.528v4.644c0 .729-.29 1.428-.805 1.944l-1.217 1.216a8.75 8.75 0 013.55.621l.502.201a7.25 7.25 0 004.178.365l-2.403-2.403a2.75 2.75 0 01-.805-1.944V3.528a40.205 40.205 0 00-3 0zm4.5.084l.19.015a.75.75 0 10.12-1.495 41.364 41.364 0 00-6.62 0 .75.75 0 00.12 1.495L7 3.612v4.56c0 .331-.132.649-.366.883L2.6 13.09c-1.496 1.496-.817 4.15 1.403 4.475C5.961 17.852 7.963 18 10 18s4.039-.148 5.997-.436c2.22-.325 2.9-2.979 1.403-4.475l-4.034-4.034A1.25 1.25 0 0113 8.172v-4.56z"
								clipRule="evenodd"
							/>
						</svg>
					}
				/>

				<span className="font-sans uppercase">
					{(result.coeffs[0]) &&
						`${result.coeffs[0]}(${result.a}) + ${result.coeffs[1]}(${result.b}) = ${result.coeffs[2]}(${result.c}) + ${result.coeffs[3]}(${result.d})`}
				</span>
			</div>
		</div>
	);
}

export default App;
