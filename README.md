# World Time Comparator - Global Clock Engine

**Developer Note (September 2026):** 
While my primary daily work focuses on complex WordPress/WooCommerce architectures and robust CMS applications, I developed this zero-framework project to demonstrate advanced proficiency with JavaScript's native `Date` object and the `Intl` API. Navigating cross-timezone logic, offset calculations, and DOM manipulation without relying on libraries like Moment.js or date-fns is a crucial exercise in maintaining strong core programming fundamentals.

## Overview
A dynamic, real-time world clock application built strictly with Vanilla JavaScript (ES6+), HTML5, and CSS3. The application allows users to compare the time across any two global locations, featuring synchronized analog and digital displays, alongside automated time-difference calculations.

## Core Features
* **Real-Time Synchronization:** Utilizes `setInterval` to accurately update local and remote time displays down to the second.
* **Dual Display Architecture:** Renders both digital readouts and dynamic analog clock hands that accurately map to hours, minutes, and seconds using CSS transforms.
* **Time Zone Resolution:** Implements the `Intl.DateTimeFormat` API for robust IANA timezone string parsing (e.g., 'America/New_York') and offset mapping.
* **Automated Difference Calculation:** Parses exact UTC offset disparities between two selected zones to determine whether one location is ahead or behind the other.

## Tech Stack
* **HTML5:** Semantic structure and `datalist` implementations for search suggestions.
* **CSS3:** Flexbox/Grid layouts, CSS variables, and rotational transformations for analog clock hands.
* **JavaScript (ES6+):** Advanced `Date` object manipulation, the Internationalization API (`Intl`), DOM querying, and error handling for invalid user inputs.

## Technical Highlights
This project avoids external date libraries to showcase raw technical problem-solving:
1. **Trigonometric DOM Manipulation:** The analog clock hands are dynamically rotated by converting current time units into precise degree values (`transform: rotate(deg)`).
2. **Error Boundary Management:** Try-catch blocks ensure the application fails gracefully (e.g., displaying "Invalid Zone") if a user types a timezone string that the `Intl` API cannot parse.
3. **Responsive Comparison Logic:** The core logic evaluates absolute differences between two disparate timezone instantiations to output a human-readable comparison (e.g., "Location 2 is 5.5 hours ahead").

## How to Run (Local Setup)
1. Clone this repository to your local machine.
2. Open the `index.html` file in any modern web browser.
3. No build tools, package managers, or local servers are required to execute the logic.

---
*Built by [Jowel Das](https://joweldas.vercel.app/) - CMS & Web Developer.*