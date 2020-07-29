function createAnalytics() {
    let counter = 0;
    let isDestroyed: boolean = false;

    const handleClick = (): number => counter++;

    document.addEventListener('click', handleClick);

    return {
        destroy() {
            document.removeEventListener('click', handleClick);
            isDestroyed = true;
        },
        getClicks() {
            if (isDestroyed) {
                return `Analytics is destroyed. Total clicks = ${counter}`;
            }
            return counter;
        }
    }
}

window['analytics'] = createAnalytics();
