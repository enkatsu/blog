
document.addEventListener('DOMContentLoaded', function () {
    const shuffle = array => {
        const cloneArray = [...array];
        const result = cloneArray.reduce((_, cur, idx) => {
            let rand = Math.floor(Math.random() * (idx + 1));
            cloneArray[idx] = cloneArray[rand]
            cloneArray[rand] = cur;
            return cloneArray
        })
        return result;
    }

    const sketchHolder = document.getElementById('sketch-holder');
    let sketchScript = document.createElement('script');
    const sketchs = [
        './sketch/01.js',
        './sketch/02.js',
        './sketch/03.js',
    ];
    sketchScript.src = shuffle(sketchs)[0];
    sketchHolder.parentNode.insertBefore(sketchScript, sketchHolder);
});
