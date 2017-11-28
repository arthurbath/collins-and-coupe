import './index.html'
import './style.scss'
import './favicon.png'
import './images/logo--opaque.png'
import './sitemap.xml'

import axios from 'axios'
import moment from 'moment'
import _find from 'lodash/find'

// Get Yelp data from backend
let businessData
axios.get('http://localhost:10001').then(response => {
	businessData = response.data
}).catch(error => {
	console.error(error)
})

// Format military time to meridiem
let militaryToMeridiem = military => moment(military, 'hhmm').format(military.slice(-2) === '00' ? 'ha' : 'h:ma')

// Fill content
let fillContent = () => {
	// For each day of the week, create a <dt> and <dd> and append to the hours container
	let hours = document.querySelector('.hours')
	;['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach((day, index) => {
		let dayElement = document.createElement('dt')
		dayElement.classList.add('hours__day')
		dayElement.textContent = day
		hours.appendChild(dayElement)

		let timeSet = _find(businessData.hours[0].open, { day: index })
		let timesElement = document.createElement('dd')
		timesElement.classList.add('hours__times')
		timesElement.textContent = timeSet
			? `${militaryToMeridiem(timeSet.start)}–${militaryToMeridiem(timeSet.end)}`
			: 'Closed'
		hours.appendChild(timesElement)
	})

	// Update Yelp link with Yelp's preferred URL, params
	let yelpLink = document.querySelector('.social__link--yelp')
	yelpLink.href = businessData.url

	// Unhide container
	let container = document.querySelector('.container')
	container.classList.remove('container--hidden')
}

document.addEventListener('DOMContentLoaded', () => {
	let container = document.querySelector('.container')
	container.classList.add('container--hidden')

	let waitForBusinessData = setInterval(() => {
		if (!businessData) { return }
		fillContent()
		clearInterval(waitForBusinessData)
	}, 500)
})