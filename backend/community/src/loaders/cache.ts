import { TagRepository } from '@/repositories/tagRepository';
import NodeCache from 'node-cache';
import Container from 'typedi';

export let tagsCache: NodeCache;
export let rateLimitCache: NodeCache

export const initializeCache = () => {
  tagsCache = new NodeCache();
  rateLimitCache = new NodeCache();
};

export const reinitializeTagsCache = async () => {
  const tagRepo: TagRepository = Container.get(TagRepository);
  await tagRepo.reinitializeCache();
};
