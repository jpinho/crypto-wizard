export const repositoryError = (msg: string) => (error: Error) => Promise.reject({ msg, detail: error });
