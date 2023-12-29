import axios from "axios";

const BATCH = 'https://myrespect.bitrix24.ru/rest/1/r0vc702sjvc3a25t/batch.json';


const batchCreater = (params) => {
	// const filter = params.filter 
	// 	? Object.keys(params.filter).map(key=>{
	// 		return params.filter[key].map((param: string, i: number)=>{
	// 			return encodeURIComponent(`filter[${key}][${i}]`)+ '=' + encodeURIComponent(`${param}`)
	// 		})
	// 	}) 
	// 	: ['']
	const filter = [], extra_arr = [], extra_str = []

	const keys_of_filter = params.filter
		? Object.keys(params.filter) 
		: ['']
	const keys_of_extras = params.extras_arrs
		? Object.keys(params.extras_arrs) 
		: ['']

		if(params.extras_string)
		for(let key in params.extras_string) {
			extra_str.push(`${key}=${params.extras_string[key]}`)
		}
		
		for(let i = 0; i < keys_of_extras.length; i++) {
			params.extras_arrs && params.extras_arrs[keys_of_extras[i]].forEach((element, j) => {
			extra_arr.push(encodeURIComponent(`[${keys_of_extras[i]}][${j}]`) + '=' + encodeURIComponent(`${element}`))
		});
	}
	for(let i = 0; i < keys_of_filter.length; i++) {
		if(params.filter && Array.isArray(params.filter[keys_of_filter[i]])){
			params.filter && params.filter[keys_of_filter[i]].forEach((element, j) => {
				filter.push(encodeURIComponent(`FILTER[${keys_of_filter[i]}][${j}]`)+ '=' + encodeURIComponent(`${element}`))
			});
		} else if(params.filter && typeof params.filter[keys_of_filter[i]] === 'string') {
			filter.push(encodeURIComponent(`FILTER[${keys_of_filter[i]}]`) + '=' + encodeURIComponent(`${params.filter[keys_of_filter[i]]}`))
		}
	}

	const select = params.select 
		? params.select.map((item, i)=>{
			return encodeURIComponent(`select[${i}]`) + '=' + encodeURIComponent(`${item}`)
		})
		: ['']

	const c = `${params.method}`+`?${params.extras_string ? extra_str.join('&') : ''}&${params.extras_arrs ? extra_arr.join('&') : ''}&${params.filter ? filter.join('&') : ''}&${params.select ? select.join('&') : ''}`
	return c
}

const fetchData = async (opts) => {
	let params = {
		[`get${0}`]: batchCreater(opts) + `&strart=${0}`
	}
	
	return await axios.post(BATCH, {
		cmd: params
	}).then(async res => {
		const arr_params = []

		if(res.data.result.result_total.get0 > 50){
			for(let i = 50; i <= res.data.result.result_total.get0; i += 50) {
				params[`get${i}`] = batchCreater(opts) + `&start=${i}`
				if(i >= res.data.result.result_total.get0 - 50 || i % 2450 === 0){
					arr_params.push(params)
					params = {}
				}
			}

			const req_data = []
			arr_params.forEach(el => 
				req_data.push(axios.post(BATCH, {
					cmd: el
				}))
			)

			const endData = await axios
				.all(req_data)
				.then(
					axios.spread((...res) => res
					.map(el => (Object.values(el.data.result.result).reduce((a, b) => a.concat(b)))))
				)
			// const endData = (Object.values(el.result.result).reduce((a, b) => a.concat(b))))

			return endData.reduce((a, b) => a.concat(b))
		} else {

			return Object.values(res.data.result.result.get0)
		}
	})
}


export default fetchData;