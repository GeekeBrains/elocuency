export async function getDynamicClass(serviceName: string) {
  try {
    const module = await import(`./services/${serviceName}`);
    return new module[serviceName]();
  } catch (error) {
    console.error('Error loading service:', error);
    throw new Error(`Service "${serviceName}" not found.`);
  }
}
