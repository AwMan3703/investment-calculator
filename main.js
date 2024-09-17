
const investment_input = document.getElementById("investment");
const start_price_input = document.getElementById("start-price");
const end_price_input = document.getElementById("end-price");
const buy_fee_input = document.getElementById("buy-fee");
const sell_fee_input = document.getElementById("sell-fee");
const min_buy_fee_input = document.getElementById("buy-min-fee");
const min_sell_fee_input = document.getElementById("sell-min-fee");

const start_button = document.getElementById("button-start");
const reinvest_button = document.getElementById("button-reinvest");

const result_output = document.getElementById("profit");
const iteration_counter_output = document.getElementById("iteration-counter");
const days_counter_output = document.getElementById("days-counter-pdt");
const weeks_counter_output = document.getElementById("weeks-counter-pdt");
const months_counter_output = document.getElementById("months-counter-pdt");

let ITERATION_COUNTER = 0



const percentageOf = (whole, percentage) => (whole / 100) * percentage

const getInputs = () => {
	return {
		investment : parseFloat(investment_input.value) || 0,
		startprice : parseFloat(start_price_input.value) || 0,
		endprice : parseFloat(end_price_input.value) || 0,
		buyfee : parseFloat(buy_fee_input.value) || 0,
		sellfee : parseFloat(sell_fee_input.value) || 0,
		minbuyfee : parseFloat(min_buy_fee_input.value) || 0,
		minsellfee : parseFloat(min_sell_fee_input.value) || 0,
	}
}

function compute(investment, start_price, end_price, buy_fee_pc, min_buy_fee, sell_fee_pc, min_sell_fee) {
	const postFeeInvestment = investment - Math.max(min_buy_fee, percentageOf(investment, buy_fee_pc))
	const assets = postFeeInvestment / start_price
	const preFeeGain = assets * end_price
	return preFeeGain - Math.max(min_sell_fee, percentageOf(preFeeGain, sell_fee_pc))
}

function update_metrics() {
	ITERATION_COUNTER += 1
	iteration_counter_output.innerText = String(ITERATION_COUNTER)
	days_counter_output.innerText = String((ITERATION_COUNTER / 3) * 7).split(/[,.]/gm)[0]
	weeks_counter_output.innerText = String(ITERATION_COUNTER / 3).split(/[,.]/gm)[0]
	months_counter_output.innerText = '~ ' + String((ITERATION_COUNTER / 3) / 4).split(/[,.]/gm)[0]
}

function reset_metrics() {
	ITERATION_COUNTER = 0
	iteration_counter_output.innerText = String(0)
	days_counter_output.innerText = String(0)
	weeks_counter_output.innerText = String(0)
	months_counter_output.innerText = '~ ' + String(0)
}

function run(reinvest) {
	const inputs = getInputs()
	result_output.innerText = compute(
		inputs.investment,
		inputs.startprice,
		inputs.endprice,
		inputs.buyfee,
		inputs.minbuyfee,
		inputs.sellfee,
		inputs.minsellfee
	)
	if (reinvest===true) {
		console.log(`reinvest=${reinvest} - updating metrics`)
		update_metrics()
	} else {
		reset_metrics()
		update_metrics()
	}
}



start_button.onclick = run
reinvest_button.onclick = _ => {
	investment_input.value = result_output.innerText.split(/[,.]/gm)[0]
	run(true)
}