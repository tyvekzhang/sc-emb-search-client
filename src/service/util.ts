export function extractFilename(disposition: string | undefined): string | null {
  if (!disposition) return null;

  const filenameMatch = disposition.split(/;(.+)/)[1]?.split(/=(.+)/)[1];
  if (!filenameMatch) return null;

  let filename = filenameMatch;
  if (filename.toLowerCase().startsWith("utf-8''")) {
    filename = decodeURIComponent(filename.replace("utf-8''", ''));
  } else {
    filename = filename.replace(/['"]/g, '');
  }
  return filename;
}
