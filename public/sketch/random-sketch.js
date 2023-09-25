
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
        './sketch/github-contributions.js',
        './sketch/noise.js',
        './sketch/dog-window.js',
        './sketch/github-languages.js',
        './sketch/blog-tag-relations01.js',
        './sketch/blog-tag-relations02.js',
    ];
    sketchScript.src = shuffle(sketchs)[0];
    // sketchScript.src = './sketch/blog-tag-relations02.js';
    sketchHolder.parentNode.insertBefore(sketchScript, sketchHolder);
    const sketchTitle = document.createElement('h1');
    const parser = new URL(sketchScript.src);
    sketchTitle.innerText = parser.pathname.split('/').pop();
    sketchHolder.parentNode.insertBefore(sketchTitle, sketchScript);
});
