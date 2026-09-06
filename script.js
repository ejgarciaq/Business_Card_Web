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

// --- Descarga de contacto (vCard .vcf) ---
// Única fuente de verdad de los datos de contacto.
const contactData = {
  firstName: 'Edson',
  lastName: 'García',
  fullName: 'Edson García',
  title: 'Ingeniero en Informática / Fullstack / Freelancer',
  org: 'WebTechCrafter',
  email: 'edson.garcia@webtechcrafter.com',
  phone: '+50670635689',
  city: 'San José',
  country: 'Costa Rica',
  url: 'https://webtechcrafter.com',
  note: 'Desarrollador web enfocado en interfaces limpias, rápidas y orientadas a resultados.',
};

// RFC 2426: los valores deben escapar \ ; , y saltos de línea.
function escapeVcardValue(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function buildVcard(data) {
  const v = escapeVcardValue;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${v(data.lastName)};${v(data.firstName)};;;`,
    `FN:${v(data.fullName)}`,
    `TITLE:${v(data.title)}`,
    `ORG:${v(data.org)}`,
    `EMAIL;TYPE=INTERNET,WORK:${v(data.email)}`,
    `TEL;TYPE=CELL,VOICE:${v(data.phone)}`,
    `ADR;TYPE=HOME:;;${v(data.city)};;;${v(data.country)}`,
    `URL:${v(data.url)}`,
    `NOTE:${v(data.note)}`,
    'END:VCARD',
  ];
  // El RFC exige CRLF; el BOM UTF-8 evita que Outlook rompa los acentos.
  return '\uFEFF' + lines.join('\r\n');
}

const vcardButton = document.getElementById('download-vcard');
if (vcardButton) {
  vcardButton.addEventListener('click', () => {
    const blob = new Blob([buildVcard(contactData)], {
      type: 'text/vcard;charset=utf-8',
    });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'edson-garcia.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);

    const originalText = vcardButton.textContent;
    vcardButton.textContent = '¡Descargado!';
    setTimeout(() => {
      vcardButton.textContent = originalText;
    }, 1400);
  });
}
