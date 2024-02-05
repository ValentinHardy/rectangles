document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("rectangleContainer");
    const recolorButton = document.getElementById("recolorButton");

    let rectangles = [];
    let rectanglesToRemove = [];
    let ongoingAnimations = 0;

    function init() {
        container.addEventListener("mousedown", startDrawing);
        container.addEventListener("dblclick", handleDoubleClick);
        recolorButton.addEventListener("click", recolorClosestRectangles);
    }

    function startDrawing(e) {
        const rect = createRectangle(e);

        // Update the size of the rectangle with mouse movement
        const mouseMoveHandler = (e) => updateRectangleSize(rect, e);
        container.addEventListener("mousemove", mouseMoveHandler);
        
        // Finish drawing the rectangle on mouseup event
        container.addEventListener("mouseup", () => {
            // Remove the mousemove event listener to stop resizing
            container.removeEventListener("mousemove", mouseMoveHandler);
            addRectangle(rect);
        }, { once: true }); // Ensure this event handler runs only once to avoid unexpected behavior
    }

    function createRectangle(e) {
        const rect = document.createElement("div");
        rect.className = "rectangle";

        // Set initial position based on the mouse event coordinates
        rect.style.left = `${e.offsetX}px`;
        rect.style.top = `${e.offsetY}px`;

        rect.style.backgroundColor = getRandomColor();
        container.appendChild(rect);

        // Hide the 'draw-text' element when drawing starts
        document.querySelector('#draw-text').style.display = 'none';
        return rect;
    }

    function updateRectangleSize(rect, e) {
        // Calculate and set new width and height based on mouse coordinates
        rect.style.width = `${Math.max(0, e.offsetX - parseInt(rect.style.left))}px`;
        rect.style.height = `${Math.max(0, e.offsetY - parseInt(rect.style.top))}px`;
    }

    function addRectangle(rect) {
        if (rect.offsetWidth > 0 && rect.offsetHeight > 0) {
            rectangles.push(rect);
        }
    }

    function handleDoubleClick(e) {
        if (e.target.className === "rectangle") {
            animateAndRemoveRectangle(e.target);
        }
    }

    function animateAndRemoveRectangle(target) {
        ongoingAnimations++;
        target.style.animation = "rotate 3s forwards";
        // Add the rectangle to the list of rectangles to be removed
        rectanglesToRemove.push(target);

        // After the animation ends, remove the rectangle from the DOM and the rectanglesToRemove array
        setTimeout(() => {
            ongoingAnimations--;
            if (ongoingAnimations === 0) {
                rectanglesToRemove.forEach(removeRectangle);
                rectanglesToRemove = [];
            }
        }, 3000); // The timeout matches the duration of the CSS animation
    }

    function removeRectangle(rectangle) {
        rectangles = rectangles.filter(rect => rect !== rectangle);
        rectangle.remove();
    }

    function recolorClosestRectangles() {
        if (rectangles.length < 2) return;

        const [closestPair, ] = findClosestPairByArea(rectangles);

        const newColor = getRandomColor();
        closestPair.forEach(rect => rect.style.backgroundColor = newColor);
    }

    // Find the two rectangles with the closest matching areas
    function findClosestPairByArea(rects) {
        let closestPair = [rects[0], rects[1]];
        let minAreaDiff = Infinity;

        // Compare each pair of rectangles to find the smallest area difference
        rects.forEach((rect1, index1) => {
            rects.slice(index1 + 1).forEach(rect2 => {
                const areaDiff = Math.abs(getArea(rect1) - getArea(rect2));
                if (areaDiff < minAreaDiff) {
                    minAreaDiff = areaDiff;
                    closestPair = [rect1, rect2];
                }
            });
        });

        return [closestPair, minAreaDiff];
    }

    function getArea(rect) {
        return rect.offsetWidth * rect.offsetHeight;
    }

    function getRandomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    init();
});
