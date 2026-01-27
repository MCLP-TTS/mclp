const initReveal = () => {
  const revealItems = document.querySelectorAll('.reveal');
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    item.classList.add('reveal-ready');
    if (rect.top <= viewportHeight * 0.9) {
      item.classList.add('is-visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => {
      if (!item.classList.contains('is-visible')) {
        observer.observe(item);
      }
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
};

const restructureSamples = () => {
  const tables = document.querySelectorAll('.demo-table');
  tables.forEach((table) => {
    if (table.dataset.contextSplit === 'true') return;
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    rows.forEach((row) => {
      const sampleCell = row.querySelector('.sample-cell');
      if (!sampleCell) return;

      const metaBlocks = Array.from(sampleCell.querySelectorAll('.meta-block'));
      if (!metaBlocks.length) return;

      const pickBlock = (keyword) => {
        const idx = metaBlocks.findIndex((block) => {
          const label = block.querySelector('.meta-label');
          return label && label.textContent.includes(keyword);
        });
        if (idx === -1) {
          return null;
        }
        return metaBlocks.splice(idx, 1)[0];
      };

      const targetBlock = pickBlock('转写文本');
      const sceneBlock = pickBlock('场景');
      const personaBlock = pickBlock('人设');

      if (!targetBlock && !sceneBlock && !personaBlock) {
        return;
      }

      const contextRow = document.createElement('tr');
      contextRow.classList.add('sample-context-row');

      const contextCell = document.createElement('td');
      contextCell.classList.add('sample-context');
      contextCell.colSpan = row.children.length;

      const contextGrid = document.createElement('div');
      contextGrid.classList.add('context-grid');

      [targetBlock, sceneBlock, personaBlock].forEach((block) => {
        if (block) {
          block.classList.add('context-block');
          contextGrid.appendChild(block);
        }
      });

      contextCell.appendChild(contextGrid);
      contextRow.appendChild(contextCell);
      row.parentNode.insertBefore(contextRow, row);

      sampleCell.classList.add('history-cell');
    });

    table.dataset.contextSplit = 'true';
  });
};

const start = () => {
  restructureSamples();
  initReveal();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
