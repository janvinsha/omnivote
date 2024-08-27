const debounce = <T extends any[]>(callback: (...args: T) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: T) => {
        clearTimeout(timeoutId as NodeJS.Timeout);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

export default debounce;
