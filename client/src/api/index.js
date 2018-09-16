import createApi from './createApi';

export const getArchetype = createApi('/archetype', 'GET');
export const getReplays = createApi('/replays', 'GET');
