import mongoose from 'mongoose';

export function buildIdFilter(id: string) {
  if (!id) return { _id: null };
  if (mongoose.Types.ObjectId.isValid(id)) {
    return {
      $or: [
        { id: id },
        { _id: new mongoose.Types.ObjectId(id) },
        { _id: id }
      ]
    };
  }
  return { id: id };
}

export function normalizeDoc<T extends Record<string, any>>(doc: T | null): T | null {
  if (!doc) return null;
  const obj = (doc && typeof (doc as any).toObject === 'function') ? (doc as any).toObject() : { ...doc };
  if (!obj.id && obj._id) {
    obj.id = obj._id.toString();
  }
  return obj;
}

export function normalizeDocs<T extends Record<string, any>>(docs: T[]): T[] {
  if (!Array.isArray(docs)) return [];
  return docs.map(normalizeDoc) as T[];
}
