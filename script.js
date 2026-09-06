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

  // Unir con CRLF según la norma RFC
  return lines.join('\r\n');
}

const vcardButton = document.getElementById('download-vcard');
if (vcardButton) {
  vcardButton.addEventListener('click', () => {
    const vcardContent = buildVcard(contactData);

    // Convertir el texto vCard a Base64 para compatibilidad universal en móviles
    // unescape(encodeURIComponent()) asegura el manejo correcto de caracteres con acentos
    const base64Vcard = btoa(unescape(encodeURIComponent(vcardContent)));
    const dataUrl = `data:text/x-vcard;charset=utf-8;base64,${base64Vcard}`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'edson-garcia.vcf';

    document.body.appendChild(link);
    link.click();
    
    // Limpieza rápida del nodo temporal
    setTimeout(() => {
      link.remove();
    }, 100);

    const originalText = vcardButton.textContent;
    vcardButton.textContent = '¡Descargado!';
    setTimeout(() => {
      vcardButton.textContent = originalText;
    }, 1400);
  });
}
