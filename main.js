// --- Search Algorithms Registry ---
// Add new algorithms here for easy extensibility
const algorithms = {
	linear: {
		name: "🔍 Linear Search",
		info: {
			how: "Checks each element in the array sequentially until the target is found or the end is reached.",
			pros: "Simple, works on unsorted arrays.",
			cons: "Slow for large arrays (O(n)).",
		},
		*search(arr, target) {
			let comparisons = 0;
			for (let i = 0; i < arr.length; i++) {
				comparisons++;
				yield { arr: arr.slice(), comparing: [i], comparisons, found: arr[i] === target, index: i };
				if (arr[i] === target) {
					return yield { arr: arr.slice(), found: true, index: i, comparisons };
				}
			}
			yield { arr: arr.slice(), found: false, index: -1, comparisons };
		},
	},
	binary: {
		name: "⚡ Binary Search",
		info: {
			how: "Repeatedly divides the sorted array in half, comparing the target to the middle element.",
			pros: "Very fast (O(log n)), but requires sorted array.",
			cons: "Only works on sorted arrays.",
		},
		*search(arr, target) {
			let left = 0,
				right = arr.length - 1,
				comparisons = 0;
			while (left <= right) {
				let mid = Math.floor((left + right) / 2);
				comparisons++;
				yield { arr: arr.slice(), comparing: [mid], comparisons, found: arr[mid] === target, index: mid };
				if (arr[mid] === target) {
					return yield { arr: arr.slice(), found: true, index: mid, comparisons };
				} else if (arr[mid] < target) {
					left = mid + 1;
				} else {
					right = mid - 1;
				}
			}
			yield { arr: arr.slice(), found: false, index: -1, comparisons };
		},
	},
	jump: {
		name: "🦘 Jump Search",
		info: {
			how: "Checks elements at fixed intervals (blocks), then does linear search in the block where the target may be.",
			pros: "Faster than linear for sorted arrays (O(√n)).",
			cons: "Requires sorted array.",
		},
		*search(arr, target) {
			let n = arr.length,
				step = Math.floor(Math.sqrt(n)),
				prev = 0,
				comparisons = 0;
			let curr = step;
			while (curr <= n && arr[Math.min(curr, n) - 1] < target) {
				comparisons++;
				yield { arr: arr.slice(), comparing: [Math.min(curr, n) - 1], comparisons };
				prev = curr;
				curr += step;
			}
			for (let i = prev; i < Math.min(curr, n); i++) {
				comparisons++;
				yield { arr: arr.slice(), comparing: [i], comparisons };
				if (arr[i] === target) {
					return yield { arr: arr.slice(), found: true, index: i, comparisons };
				}
			}
			yield { arr: arr.slice(), found: false, index: -1, comparisons };
		},
	},
	interpolation: {
		name: "📈 Interpolation Search",
		info: {
			how: "Estimates the position of the target based on the value, like a smarter binary search. Works best on uniformly distributed sorted arrays.",
			pros: "O(log log n) for uniform data, faster than binary in best case.",
			cons: "Requires sorted, uniformly distributed array.",
		},
		*search(arr, target) {
			let low = 0,
				high = arr.length - 1,
				comparisons = 0;
			while (low <= high && target >= arr[low] && target <= arr[high]) {
				let pos = low + Math.floor(((high - low) / (arr[high] - arr[low] || 1)) * (target - arr[low]));
				comparisons++;
				yield { arr: arr.slice(), comparing: [pos], comparisons };
				if (arr[pos] === target) {
					return yield { arr: arr.slice(), found: true, index: pos, comparisons };
				}
				if (arr[pos] < target) low = pos + 1;
				else high = pos - 1;
			}
			yield { arr: arr.slice(), found: false, index: -1, comparisons };
		},
	},
	exponential: {
		name: "🚀 Exponential Search",
		info: {
			how: "Finds range by repeated doubling, then does binary search in that range.",
			pros: "O(log n), good for unbounded/infinite lists.",
			cons: "Requires sorted array.",
		},
		*search(arr, target) {
			let n = arr.length,
				comparisons = 0;
			if (n === 0) return yield { arr: arr.slice(), found: false, index: -1, comparisons };
			if (arr[0] === target) return yield { arr: arr.slice(), found: true, index: 0, comparisons: 1 };
			let i = 1;
			while (i < n && arr[i] <= target) {
				comparisons++;
				yield { arr: arr.slice(), comparing: [i], comparisons };
				i *= 2;
			}
			let left = Math.floor(i / 2),
				right = Math.min(i, n - 1);
			// Binary search in found range
			while (left <= right) {
				let mid = Math.floor((left + right) / 2);
				comparisons++;
				yield { arr: arr.slice(), comparing: [mid], comparisons };
				if (arr[mid] === target) {
					return yield { arr: arr.slice(), found: true, index: mid, comparisons };
				} else if (arr[mid] < target) {
					left = mid + 1;
				} else {
					right = mid - 1;
				}
			}
			yield { arr: arr.slice(), found: false, index: -1, comparisons };
		},
	},
};

// --- Sidebar Generation ---
function renderSidebar() {
	const algList = document.getElementById("algList");
	algList.innerHTML = "";
	const algKeys = Object.keys(algorithms);
	algKeys.forEach((key) => {
		const alg = algorithms[key];
		const li = document.createElement("li");
		const btn = document.createElement("button");
		btn.className = "alg-btn btn w-100 mb-2 btn-" + (key === currentAlg ? "light" : "outline-light");
		btn.dataset.alg = key;
		btn.textContent = alg.name;
		li.appendChild(btn);
		algList.appendChild(li);
	});
}

// --- State ---
let currentAlg = Object.keys(algorithms)[0];
let array = [];
let originalArray = [];
let sorting = false;
let searchGen = null;
let animationId = null;
let speed = 350;
let stats = { comparisons: 0, time: 0, found: false, index: -1 };
let timerStart = 0;

// --- DOM Elements ---
const visualizer = document.getElementById("visualizer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const setArrayBtn = document.getElementById("setArrayBtn");
const randomArrayBtn = document.getElementById("randomArrayBtn");
const arrayInput = document.getElementById("arrayInput");
const targetInput = document.getElementById("targetInput");
const speedSlider = document.getElementById("speedSlider");
speedSlider.value = speed;
const speedValue = document.getElementById("speedValue");

function getAlgBtns() {
	return document.querySelectorAll(".alg-btn");
}

// --- Utility Functions ---
function renderArray(arr, comparing = [], foundIdx = -1, notFoundIdx = -1) {
	visualizer.innerHTML = "";
	const maxVal = Math.max(...arr, 1);
	arr.forEach((val, idx) => {
		const bar = document.createElement("div");
		bar.className = "bar default";
		bar.style.height = (val / maxVal) * 90 + 10 + "%";
		bar.textContent = val;
		if (comparing && comparing.includes(idx)) {
			bar.classList.remove("default");
			bar.classList.add("comparing");
		}
		if (foundIdx === idx) {
			bar.classList.remove("default");
			bar.classList.add("found");
		}
		if (notFoundIdx === idx) {
			bar.classList.remove("default");
			bar.classList.add("notfound");
		}
		visualizer.appendChild(bar);
	});
}

function resetArray() {
	array = originalArray.slice();
	renderArray(array);
	sorting = false;
	startBtn.disabled = false;
	stats = { comparisons: 0, time: 0, found: false, index: -1 };
	updateStats();
}

function setArrayFromInput() {
	const input = arrayInput.value.trim();
	let errorDiv = document.getElementById("arrayInputError");
	if (errorDiv) errorDiv.remove();
	if (!input) return;
	let arr = input
		.split(",")
		.map((x) => parseInt(x, 10))
		.filter((x) => !isNaN(x));
	if (arr.length < 1 || arr.length > 40) {
		showArrayInputError("Array must have between 1 and 40 numbers.");
		return;
	}
	if (arr.some((x) => !Number.isFinite(x))) {
		showArrayInputError("All values must be valid numbers.");
		return;
	}
	// Always sort the array and update the input field
	arr.sort((a, b) => a - b);
	arrayInput.value = arr.join(",");
	array = arr;
	originalArray = arr.slice();
	renderArray(array);
	updateStats();
}

function showArrayInputError(msg) {
	let error = document.getElementById("arrayInputError");
	if (!error) {
		error = document.createElement("div");
		error.id = "arrayInputError";
		error.className = "text-danger mt-1";
		arrayInput.parentNode.appendChild(error);
	}
	error.textContent = msg;
}

function setRandomArray() {
	const len = Math.floor(Math.random() * 11) + 20; // 20-30 elements
	array = Array.from({ length: len }, () => Math.floor(Math.random() * 40) + 1);
	array.sort((a, b) => a - b); // Ensure sorted array
	originalArray = array.slice();
	if (arrayInput) arrayInput.value = array.join(",");
	// Set target to a random element from the array
	if (typeof targetInput !== "undefined" && targetInput && array.length > 0) {
		const randIdx = Math.floor(Math.random() * array.length);
		targetInput.value = array[randIdx];
	}
	renderArray(array);
	updateStats();
}

// --- Initial Render ---
setRandomArray();
renderSidebar();
setupEventListeners();
renderArray(array);
renderAlgInfo();
updateStats();

function updateStats() {
	let t = stats.time ? (stats.time / 1000).toFixed(2) : "0.00";
	const setText = (id, val) => {
		const el = document.getElementById(id);
		if (el) el.textContent = val;
	};
	setText("algTime", t + "s");
	setText("algComparisons", stats.comparisons);
	setText("algResult", stats.found ? `Found at index ${stats.index}` : stats.found === false && stats.index === -1 ? "Not found" : "-");
	const title = document.getElementById("algTitle");
	if (title) title.textContent = algorithms[currentAlg].name;

	// Calculate min/max comparisons for current algorithm and array length
	let min = 0,
		max = 0;
	const n = array.length;
	if (algorithms[currentAlg] && n > 0) {
		switch (currentAlg) {
			case "linear":
				min = 1;
				max = n;
				break;
			case "binary":
				min = 1;
				max = Math.ceil(Math.log2(n)) + 1;
				break;
			case "jump":
				min = 1;
				max = Math.ceil(Math.sqrt(n)) + Math.ceil(Math.sqrt(n));
				break;
			case "interpolation":
				min = 1;
				max = Math.ceil(Math.log2(n));
				break;
			case "exponential":
				min = 1;
				max = Math.ceil(Math.log2(n)) + 1;
				break;
			default:
				min = 1;
				max = n;
		}
	}
	setText("algMinComparisons", min);
	setText("algMaxComparisons", max);
}

// --- Live Timer ---
let timerInterval = null;
function startLiveTimer() {
	if (timerInterval) clearInterval(timerInterval);
	timerInterval = setInterval(() => {
		if (sorting) {
			stats.time = Date.now() - timerStart;
			const timeSpan = document.getElementById("algTime");
			if (timeSpan) timeSpan.textContent = (stats.time / 1000).toFixed(2) + "s";
		}
	}, 60);
}
function stopLiveTimer() {
	if (timerInterval) clearInterval(timerInterval);
}

function animateSearch() {
	if (!searchGen) return;
	const { value, done } = searchGen.next();
	if (value) {
		if ("comparisons" in value) stats.comparisons = value.comparisons;
		if ("found" in value) stats.found = value.found;
		if ("index" in value) stats.index = value.index;
		renderArray(value.arr, value.comparing || [], value.found ? value.index : -1, value.found === false && value.index !== undefined ? value.index : -1);
	}
	if (!done) {
		animationId = setTimeout(animateSearch, speed);
		updateStats();
	} else {
		sorting = false;
		startBtn.disabled = false;
		stopLiveTimer();
		updateStats();
	}
}

function setupEventListeners() {
	startBtn.onclick = () => {
		if (sorting) return;
		sorting = true;
		startBtn.disabled = true;
		stats = { comparisons: 0, time: 0, found: false, index: -1 };
		updateStats();
		timerStart = Date.now();
		const target = parseInt(targetInput.value, 10);
		if (isNaN(target)) {
			showArrayInputError("Please enter a valid target value.");
			sorting = false;
			startBtn.disabled = false;
			return;
		}
		searchGen = algorithms[currentAlg].search(array.slice(), target);
		startLiveTimer();
		animateSearch();
	};

	resetBtn.onclick = () => {
		if (animationId) {
			clearTimeout(animationId);
			animationId = null;
		}
		stopLiveTimer();
		sorting = false;
		startBtn.disabled = false;
		resetArray();
	};

	setArrayBtn.onclick = () => {
		setArrayFromInput();
	};

	randomArrayBtn.onclick = () => {
		setRandomArray();
	};
	speedSlider.oninput = function () {
		speed = Number(this.value);
		speedValue.textContent = this.value + "ms";
		if (sorting) {
			clearTimeout(animationId);
			animateSearch();
		}
	};

	getAlgBtns().forEach((btn) => {
		btn.onclick = () => {
			const alg = btn.dataset.alg;
			if (alg === currentAlg) return;
			currentAlg = alg;
			if (animationId) {
				clearTimeout(animationId);
				animationId = null;
			}
			stopLiveTimer();
			sorting = false;
			startBtn.disabled = false;
			resetArray();
			renderAlgInfo();
			getAlgBtns().forEach((b) => {
				b.classList.remove("btn-light");
				b.classList.add("btn-outline-light");
			});
			btn.classList.add("btn-light");
			btn.classList.remove("btn-outline-light");
		};
	});
}

window.algorithms = algorithms;
window.renderArray = renderArray;
window.setRandomArray = setRandomArray;
window.resetArray = resetArray;
window.setArrayFromInput = setArrayFromInput;

function renderAlgInfo() {
	const infoDiv = document.getElementById("algInfoContent");
	const alg = algorithms[currentAlg];
	if (!infoDiv || !alg) return;
	if (!alg.info) {
		infoDiv.innerHTML = "<em>No info available.</em>";
		return;
	}
	infoDiv.innerHTML = `
		<div><b>How it works:</b><br>${alg.info.how}</div>
		<div class="mt-2"><b>Pros:</b><br>${alg.info.pros}</div>
		<div class="mt-2"><b>Cons:</b><br>${alg.info.cons}</div>
	`;
}
