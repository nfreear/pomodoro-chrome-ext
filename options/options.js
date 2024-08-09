/*!

  © NDF, 08-August-2024.
*/

const _storage = chrome.storage.local;
const blockListForm = document.querySelector('#blockListForm');
const durationForm = document.querySelector('#durationForm');

blockListForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();

  const url = ev.target.elements.url.value;
  const output = ev.target.elements.output;

  output.value += url + '\n';

  const { blockList } = await _storage.get('blockList');

  console.debug('submit:', url, blockList, output, ev);

  if (isArray(blockList)) {
    blockList.push(url);

    await _storage.set({ blockList }); // , () => console.debug('storage ~ set:', blockList));
    // _storage.set(blockList).then(() => console.debug('storage ~ set OK:', blockList));
  } else {
    await _storage.set({ blockList: [url] });
  }
});

durationForm.elements.duration.addEventListener('change', async (ev) => {
  await _storage.set({ duration: ev.target.value });

  console.debug('duration change:', ev.target.value, ev);
});

(async () => {
  // const blockList = await _storage.get('blockList');
  const { blockList, duration } = await _storage.get();

  console.debug('storage ~ duration, blockList:', duration, blockList);
})();

function isArray (somevar) {
  return somevar.constructor.name === 'Array';
}

console.debug('options.js');