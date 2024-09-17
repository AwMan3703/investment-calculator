
const investment_input = document.getElementById("investment");
const start_price_input = document.getElementById("start-price");
const leverage_checkbox = document.getElementById("leverage-checkbox");
const leverage_multiplier_input = document.getElementById("leverage-multiplier");
const end_price_input = document.getElementById("end-price");
const buy_fee_input = document.getElementById("buy-fee");
const sell_fee_input = document.getElementById("sell-fee");
const min_buy_fee_input = document.getElementById("buy-min-fee");
const min_sell_fee_input = document.getElementById("sell-min-fee");
const reinvest_percentage_input = document.getElementById("reinvest-percentage");
const reinvest_add_amount_input = document.getElementById("reinvest-add-amount");

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
		useleverage : leverage_checkbox.checked,
		leveragemultiplier : parseFloat(leverage_multiplier_input.value) || 1,
		endprice : parseFloat(end_price_input.value) || 0,
		buyfee : parseFloat(buy_fee_input.value) || 0,
		sellfee : parseFloat(sell_fee_input.value) || 0,
		minbuyfee : parseFloat(min_buy_fee_input.value) || 0,
		minsellfee : parseFloat(min_sell_fee_input.value) || 0,
		reinvestpercentage : parseFloat(reinvest_percentage_input.value) || 0,
		reinvestaddamount : parseFloat(reinvest_add_amount_input.value) || 0
	}
}

function compute(investment, start_price, leverage_multiplier, end_price, buy_fee_pc, min_buy_fee, sell_fee_pc, min_sell_fee) {
	const leveragedInvestment = investment * leverage_multiplier
	const postFeeInvestment = leveragedInvestment - Math.max(min_buy_fee, percentageOf(leveragedInvestment, buy_fee_pc))
	const assets = postFeeInvestment / start_price
	const returnOnInvestment = assets * end_price
	const postFeeReturn = returnOnInvestment - Math.max(min_sell_fee, percentageOf(returnOnInvestment, sell_fee_pc))
	const unleveragedProfit = (postFeeReturn - leveragedInvestment)
	return investment + unleveragedProfit
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
	
	let invest_amount = reinvest
		? percentageOf(inputs.investment, inputs.reinvestpercentage)
		: inputs.investment
	invest_amount = reinvest
		? invest_amount + inputs.reinvestaddamount
		: invest_amount
	
	result_output.innerText = compute(
		invest_amount,
		inputs.startprice,
		inputs.useleverage ? inputs.leveragemultiplier : 1,
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
		console.log(`reinvest=${reinvest} - resetting metrics`)
		reset_metrics()
		update_metrics()
	}
}



leverage_checkbox.onclick = _ => {
	leverage_multiplier_input.toggleAttribute('disabled')
}

start_button.onclick = _ => {
	run(false)
}
reinvest_button.onclick = _ => {
	investment_input.value = result_output.innerText.split(/[,.]/gm)[0]
	run(true)
}