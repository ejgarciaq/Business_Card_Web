const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const copyButton = document.querySelector('[data-copy]');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const value = copyButton.dataset.copy || '';

    try {
      await navigator.clipboard.writeText(value);
      const originalText = copyButton.textContent;
      copyButton.textContent = '¡Copiado!';
      copyButton.disabled = true;

      setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.disabled = false;
      }, 1400);
    } catch (error) {
      console.error('No se pudo copiar el email:', error);
    }
  });
}
