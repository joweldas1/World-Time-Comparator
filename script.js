const tz1Input = document.getElementById("timezone1");
const tz2Input = document.getElementById("timezone2");
const datalist = document.getElementById("city-options");
const time1Elem = document.getElementById("time1");
const date1Elem = document.getElementById("date1");
const offset1Elem = document.getElementById("offset1");
const time2Elem = document.getElementById("time2");
const date2Elem = document.getElementById("date2");
const offset2Elem = document.getElementById("offset2");
const localLiveClock = document.getElementById("local-live-clock");
const timeDiffElem = document.getElementById("time-diff");

// Popular cities and districts mapping to IANA Timezones
const cityTimezones = {
    "dhaka": "Asia/Dhaka",
    "barishal": "Asia/Dhaka",
    "chittagong": "Asia/Dhaka",
    "sylhet": "Asia/Dhaka",
    "rajshahi": "Asia/Dhaka",
    "khulna": "Asia/Dhaka",
    "rangpur": "Asia/Dhaka",
    "mymensingh": "Asia/Dhaka",
    "cumilla": "Asia/Dhaka",
    "cox's bazar": "Asia/Dhaka",
    "london": "Europe/London",
    "new york": "America/New_York",
    "tokyo": "Asia/Tokyo",
    "dubai": "Asia/Dubai",
    "sydney": "Australia/Sydney",
    "toronto": "America/Toronto",
    "singapore": "Asia/Singapore",
    "paris": "Europe/Paris",
    "berlin": "Europe/Berlin",
    "los angeles": "America/Los_Angeles"
};

function populateSuggestions() {
    for (let city in cityTimezones) {
        const option = document.createElement("option");
        option.value = city.charAt(0).toUpperCase() + city.slice(1);
        datalist.appendChild(option);
    }
    
    // Also include standard IANA zones for fallback
    Intl.supportedValuesOf('timeZone').forEach(tz => {
        const option = document.createElement("option");
        option.value = tz;
        datalist.appendChild(option);
    });

    tz1Input.value = "Barishal"; // Default set as requested
    tz2Input.value = "London";
}

function getTimeZone(inputVal) {
    const key = inputVal.trim().toLowerCase();
    if (cityTimezones[key]) {
        return cityTimezones[key];
    }
    return inputVal.trim();
}

function getOffset(timeZone) {
    try {
        const now = new Date();
        const tzString = now.toLocaleString('en-US', { timeZone, timeZoneName: 'shortOffset' });
        const match = tzString.match(/GMT[+-]\d{1,2}(?::\d{2})?/);
        return match ? match[0] : '';
    } catch (e) {
        return '';
    }
}

function isValidTimeZone(tz) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch (e) {
        return false;
    }
}

function updateClockHands(now, tz, hourElemId, minElemId, secElemId) {
    try {
        const tzTimeStr = now.toLocaleString('en-US', { timeZone: tz });
        const tzDate = new Date(tzTimeStr);
        
        const hours = tzDate.getHours();
        const minutes = tzDate.getMinutes();
        const seconds = tzDate.getSeconds();

        const secDeg = (seconds / 60) * 360;
        const minDeg = ((minutes + seconds / 60) / 60) * 360;
        const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

        document.getElementById(hourElemId).style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
        document.getElementById(minElemId).style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        document.getElementById(secElemId).style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    } catch (e) {
        // Ignore if invalid zone
    }
}

function updateClocks() {
    const now = new Date();
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localLiveClock.innerHTML = `<i class="fa-regular fa-clock"></i> Your Local Time: ${now.toLocaleTimeString()} (${userTz})`;

    // Location 1 Update
    const rawTz1 = tz1Input.value;
    const tz1 = getTimeZone(rawTz1);
    
    if (isValidTimeZone(tz1)) {
        try {
            const optionsTime = { timeZone: tz1, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const optionsDate = { timeZone: tz1, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            
            time1Elem.textContent = new Intl.DateTimeFormat('en-US', optionsTime).format(now);
            date1Elem.textContent = new Intl.DateTimeFormat('en-US', optionsDate).format(now);
            offset1Elem.textContent = `Zone: ${tz1} (${getOffset(tz1)})`;
            updateClockHands(now, tz1, 'hour1', 'min1', 'sec1');
        } catch (e) {
            time1Elem.textContent = "Invalid Zone";
        }
    } else {
        time1Elem.textContent = "Select valid zone";
        date1Elem.textContent = "";
        offset1Elem.textContent = "";
    }

    // Location 2 Update
    const rawTz2 = tz2Input.value;
    const tz2 = getTimeZone(rawTz2);

    if (isValidTimeZone(tz2)) {
        try {
            const optionsTime = { timeZone: tz2, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const optionsDate = { timeZone: tz2, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            
            time2Elem.textContent = new Intl.DateTimeFormat('en-US', optionsTime).format(now);
            date2Elem.textContent = new Intl.DateTimeFormat('en-US', optionsDate).format(now);
            offset2Elem.textContent = `Zone: ${tz2} (${getOffset(tz2)})`;
            updateClockHands(now, tz2, 'hour2', 'min2', 'sec2');
        } catch (e) {
            time2Elem.textContent = "Invalid Zone";
        }
    } else {
        time2Elem.textContent = "Select valid zone";
        date2Elem.textContent = "";
        offset2Elem.textContent = "";
    }

    if (isValidTimeZone(tz1) && isValidTimeZone(tz2)) {
        calculateTimeDifference(tz1, tz2, now);
    } else {
        timeDiffElem.textContent = "Please select valid locations to compare.";
    }
}

function calculateTimeDifference(tz1, tz2, now) {
    try {
        const time1Obj = new Date(now.toLocaleString('en-US', { timeZone: tz1 }));
        const time2Obj = new Date(now.toLocaleString('en-US', { timeZone: tz2 }));
        
        const diffMs = time2Obj - time1Obj;
        const diffHours = diffMs / (1000 * 60 * 60);

        let diffText = "";
        if (Math.abs(diffHours) < 0.01) {
            diffText = "Both selected locations are in the exact same time zone.";
        } else if (diffHours > 0) {
            diffText = `Location 2 is <span style="color: #3b82f6; font-weight: 600;">${diffHours.toFixed(1)} hours ahead</span> of Location 1.`;
        } else {
            diffText = `Location 2 is <span style="color: #ef4444; font-weight: 600;">${Math.abs(diffHours).toFixed(1)} hours behind</span> Location 1.`;
        }
        timeDiffElem.innerHTML = diffText;
    } catch (e) {
        timeDiffElem.textContent = "Could not calculate time difference.";
    }
}

tz1Input.addEventListener('input', updateClocks);
tz2Input.addEventListener('input', updateClocks);

populateSuggestions();
updateClocks();
setInterval(updateClocks, 1000);