import { modelManager } from 'viewar-api';

export default async function(idOrForeignKey) {
  return (
    modelManager.findModelById(idOrForeignKey) ||
    modelManager.findModelByForeignKey(idOrForeignKey) ||
    (await modelManager.fetchModelFromRepository(idOrForeignKey))
  );
}
