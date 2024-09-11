type TsysRoles = {
  User: string;
  Admin: string;
};
export const sysRoles: TsysRoles = {
  User: 'User',
  Admin: 'Admin',
};

export const taskTypes: { manyTask: string; oneTask: string } = {
  manyTask: 'ManyTask',
  oneTask: 'OneTask',
};

type TfileTypes = {
  image: string;
  text: string;
  audio: string;
  video: string;
  application: string;
  font: string;
  multipart: string;
};

export const fileTypes: TfileTypes = {
  image: 'image',
  text: 'text',
  audio: 'audio',
  video: 'video',
  application: 'application',
  font: 'font',
  multipart: 'multipart',
};

export const cloudinaryFolderPath: string = 'TrelloNest/Task';
