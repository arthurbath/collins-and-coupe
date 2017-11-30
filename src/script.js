import './index.html'
import './style.scss'
import './favicon.png'
import './images/logo--opaque.png'
import './sitemap.xml'

import moment from 'moment'

const daysOfWeek = [{
	displayName: 'Monday',
	day: 1,
}, {
	displayName: 'Tuesday',
	day: 2,
}, {
	displayName: 'Wednesday',
	day: 3,
}, {
	displayName: 'Thursday',
	day: 4,
}, {
	displayName: 'Friday',
	day: 5,
}, {
	displayName: 'Saturday',
	day: 6,
}, {
	displayName: 'Sunday',
	day: 0,
}]

// Callback initiated by Google Place API
let businessInfo
window.setBusinessInfo = () => {
	const map = new google.maps.Map(document.querySelector('.map')) // eslint-disable-line no-undef
	const service = new google.maps.places.PlacesService(map) // eslint-disable-line no-undef
	service.getDetails({ placeId: 'ChIJk4sOf_lU2YAR1SxMa5Rdxic' }, place => {
		businessInfo = place
	})
}

// Format military time to meridiem
let militaryToMeridiem = military => moment(military, 'hhmm').format(military.slice(-2) === '00' ? 'ha' : 'h:ma')

document.addEventListener('DOMContentLoaded', () => {
	let container = document.querySelector('.container')
	container.classList.add('container--hidden') // When JS enabled, hide container until hours populate

	let waitForBusinessInfoIterations = 0
	let waitForBusinessInfo = setInterval(() => {
		// If the browser has been waiting for business info too long, reveal container
		waitForBusinessInfoIterations += 1
		if (waitForBusinessInfoIterations > 5) {
			stopWaitingForBusinessInfo()
		}

		if (!businessInfo) { return }

		// For each day of the week, create a <dt> and <dd> and append to the hours container
		let hours = document.querySelector('.hours')
		daysOfWeek.forEach(dayOfWeek => {
			let dayElement = document.createElement('dt')
			dayElement.classList.add('hours__day')
			dayElement.textContent = dayOfWeek.displayName
			hours.appendChild(dayElement)

			// Find the time-set that corresponds to the current day of the week
			let timeSet
			businessInfo.opening_hours.periods.forEach(period => {
				if (period.open.day === dayOfWeek.day) {
					timeSet = period
				}
			})

			let timesElement = document.createElement('dd')
			timesElement.classList.add('hours__times')
			timesElement.textContent = timeSet
				? `${militaryToMeridiem(timeSet.open.time)}–${militaryToMeridiem(timeSet.close.time)}`
				: 'Closed'
			hours.appendChild(timesElement)

			stopWaitingForBusinessInfo()
		})
	}, 500)

	function stopWaitingForBusinessInfo () {
		clearInterval(waitForBusinessInfo) // Stop interval
		container.classList.remove('container--hidden') // Show container
	}
})