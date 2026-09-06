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
  lastName: 'Garcia',
  fullName: 'Edson Garcia',
  title: 'Ingeniero en Informatica / Fullstack / Freelancer',
  org: 'WebTechCrafter',
  email: 'edson.garcia.cr@outlook.com',
  phone: '+50670635689',
  city: 'San José',
  country: 'Costa Rica',
  url: 'https://webtechcrafter.com',
  note: 'Desarrollador web enfocado en interfaces limpias, rápidas y orientadas a resultados.',
};

// RFC 2426 / vCard 3.0: Escapar caracteres especiales
function escapeVcardValue(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function buildVcard(data, { withBom = false } = {}) {
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
    `ADR;TYPE=WORK:;;;${v(data.city)};;;${v(data.country)}`,
    `URL:${v(data.url)}`,
    `NOTE:${v(data.note)}`,
    'END:VCARD'
  ];

  // CRLF según RFC 2426. El BOM solo para Outlook: iOS/Android tienen parsers
  // estrictos que rechazan el archivo si no empieza exactamente con "BEGIN:VCARD".
  return (withBom ? '\uFEFF' : '') + lines.join('\r\n');
}

function downloadVcard(filename, vcardContent) {
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(blobUrl);
  }, 1500);
}

function showFeedback(button) {
  const originalText = button.dataset.originalText || button.textContent;
  button.dataset.originalText = originalText;
  button.textContent = '¡Descargado!';
  setTimeout(() => {
    button.textContent = originalText;
  }, 1400);
}

// Móvil: sin BOM. iOS no "descarga": abre el .vcf en pestaña nueva y ofrece
// "Agregar a contactos" nativamente. Android Chrome sí respeta el download.
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const vcardMobileButton = document.getElementById('download-vcard');
if (vcardMobileButton) {
  vcardMobileButton.addEventListener('click', () => {
    const vcardContent = buildVcard(contactData);

    if (isIOS) {
      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
      window.open(URL.createObjectURL(blob), '_blank');
    } else {
      downloadVcard('edson-garcia.vcf', vcardContent);
    }

    showFeedback(vcardMobileButton);
  });
}

// Outlook de escritorio: con BOM, siempre descarga.
const vcardOutlookButton = document.getElementById('download-vcard-outlook');
if (vcardOutlookButton) {
  vcardOutlookButton.addEventListener('click', () => {
    downloadVcard('edson-garcia-outlook.vcf', buildVcard(contactData, { withBom: true }));
    showFeedback(vcardOutlookButton);
  });
}
