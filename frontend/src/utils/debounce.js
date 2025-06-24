export function debounce(func, wait) {
    let timeout = null;
    const debounced = function (...args) {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
    debounced.cancel = function () {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return debounced;
}
