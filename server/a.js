function a() {
    console.log('from a.js');
    throw new Error('Fail a.js a()');
}
const testScriptError = document.querySelector('#testScriptError');
testScriptError.addEventListener('click', () => {
    throw new Error('Fail a.js testScriptError() ');
});
