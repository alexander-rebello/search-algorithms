# Search Algorithms Visualizer

A modern, responsive, single-page web app for visualizing and comparing popular search algorithms. Built with HTML, Bootstrap, and vanilla JavaScript. Easily extensible and designed for clarity, education, and experimentation.

## Features

- **Multiple Algorithms**: Visualize and compare a wide range of search algorithms:
  - 🔍 Linear Search
  - ⚡ Binary Search
  - 🦘 Jump Search
  - 📈 Interpolation Search
  - 🚀 Exponential Search
- **Animated Visualization**: Step-by-step, color-coded bar animations for comparisons and found/not found results.
- **Live Stats**: Real-time updates for comparisons, elapsed time, and result (found/not found, index).
- **Responsive UI**: Clean, mobile-friendly layout using Bootstrap grid, cards, and utility classes. Minimal custom CSS.
- **Custom & Random Arrays**: Enter your own array or generate a random one (5–10 elements, values 1–40).
- **Target Input**: Enter the value to search for.
- **Abort/Reset**: Instantly stop and reset any running search.
- **Algorithm Info**: Sidebar with algorithm selection and detailed info (how it works, pros, cons).
- **Extensible**: Add new algorithms easily by editing the `algorithms` object in `main.js`.

## How to Use

1. **Open `index.html` in your browser.**
2. **Choose an algorithm** from the sidebar.
3. **Set an array**:
   - Enter comma-separated numbers (1–20 elements, each 1–40) and click "Set Array".
   - Or click "Random" for a random array.
4. **Enter a target value** in the input box.
5. **Adjust speed** with the slider (50–1000ms per step).
6. **Click "Start"** to animate the search. Click "Reset" to abort and reset.
7. **Switch algorithms** at any time—this will reset the array and stats.

## Color Coding

- **Blue (`bg-primary`)**: Default bars
- **Red (`bg-danger`)**: Comparing
- **Green (`bg-success`)**: Found
- **Yellow (`bg-warning`)**: Not found (last checked)

## Algorithms Implemented

| Name                 | Emoji | Type          | Sorted Required | Time Complexity (Best/Average/Worst) |
| -------------------- | ----- | ------------- | --------------- | ------------------------------------ |
| Linear Search        | 🔍    | Sequential    | No              | O(1) / O(n) / O(n)                   |
| Binary Search        | ⚡    | Divide & Conq | Yes             | O(1) / O(log n) / O(log n)           |
| Jump Search          | 🦘    | Block         | Yes             | O(√n) / O(√n) / O(n)                 |
| Interpolation Search | 📈    | Estimate      | Yes             | O(1) / O(log log n) / O(n)           |
| Exponential Search   | 🚀    | Exponential   | Yes             | O(log n) / O(log n) / O(log n)       |

## File Structure

- `index.html` — Main HTML file, includes Bootstrap and links to CSS/JS
- `main.js` — All algorithm logic, UI rendering, and event handling
- `style.css` — Minimal custom CSS (only for bar height and color classes)

## How to Add a New Algorithm

1. Open `main.js`.
2. Add a new entry to the `algorithms` object with:
   - `name`: Display name (with emoji if you like)
   - `info`: `{ how, pros, cons }` strings
   - `*search(arr, target)`: Generator function yielding visualization steps
3. The sidebar and UI will update automatically.

## Requirements

- Modern browser (Chrome, Firefox, Edge, Safari)
- No build step or server required

## Credits

- Built by Alex with help from GitHub Copilot
- Uses [Bootstrap 5](https://getbootstrap.com/) for layout and styling

---

Enjoy learning and experimenting with search algorithms!
