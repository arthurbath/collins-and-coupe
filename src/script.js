import './index.html'
import './style.scss'
import './favicon.png'
import './images/logo--opaque.png'
import './sitemap.xml'

import axios from 'axios'
import moment from 'moment'

// Get Yelp data from backend
let businessData
axios.get('http://localhost:10001').then(response => {
	businessData = response.data
}).catch(error => {
	console.log(error)
})

// Format military time to meridiem
let militaryToMeridiem = military => moment(military, 'hhmm').format(military.slice(-2) === '00' ? 'ha' : 'h:ma')

// Fill content
let fillContent = () => {
	let address1 = document.querySelector('.jsAddress1')
	let address2 = document.querySelector('.jsAddress2')
	address1.textContent = businessData.location.display_address[0]
	address2.textContent = businessData.location.display_address[1]

	let hours = document.querySelectorAll('.jsHours')
	businessData.hours[0].open.forEach(hourSet => {
		hours[hourSet.day].textContent = `${militaryToMeridiem(hourSet.start)}–${militaryToMeridiem(hourSet.end)}`
	})

	let phone = document.querySelector('.jsPhone')
	phone.textContent = businessData.display_phone
	phone.href = `tel:${businessData.phone}`

	let yelpLink = document.querySelector('.jsYelpLink')
	yelpLink.href = businessData.url

	let container = document.querySelector('.jsContainer')
	container.classList.add('container--revealed')
}

document.addEventListener('DOMContentLoaded', () => {
	let waitForBusinessData = setInterval(() => {
		if (!businessData) { return }
		fillContent()
		clearInterval(waitForBusinessData)
	}, 500)
})