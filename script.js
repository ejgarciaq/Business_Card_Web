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
  title: 'Ingeniero en Informática / Fullstack / Freelancer',
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
    `ADR;TYPE=WORK:;;;${v(data.city)};;;${v(data.country)}`,
    `URL:${v(data.url)}`,
    `NOTE:${v(data.note)}`,
    'END:VCARD'
  ];

  // BOM UTF-8 obligatorio para que Outlook lea bien los acentos; CRLF según RFC 2426
  return '\uFEFF' + lines.join('\r\n');
}

const vcardButton = document.getElementById('download-vcard');
if (vcardButton) {
  vcardButton.addEventListener('click', () => {
    const vcardContent = buildVcard(contactData);
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    // Estrategia 1: descarga con atributo download (Android Chrome, desktop)
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'edson-garcia.vcf';
    document.body.appendChild(link);
    link.click();

    // Estrategia 2 (fallback iOS Safari): abrir el vCard directo —
    // iOS lo interpreta como "Agregar a contactos" sin descargar.
    // Se hace con delay para no bloquear la descarga anterior.
    setTimeout(() => {
      window.open(blobUrl, '_blank');
    }, 300);

    // Limpieza del blob URL y nodo temporal
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(blobUrl);
    }, 1500);

    const originalText = vcardButton.textContent;
    vcardButton.textContent = '¡Descargado!';
    setTimeout(() => {
      vcardButton.textContent = originalText;
    }, 1400);
  });
}
