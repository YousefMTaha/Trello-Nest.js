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

type TuserModel = {
  password: string;
  email: string;
  confirmEmail: string;
  age: string;
  role: string;
};

type TtaskModel = {
  title: string;
  content: string;
  list: string;
  owner: string;
  deadline: string;
  completed: string;
  attachments: string;
};

type TsysFields = {
  user: TuserModel;
  task: TtaskModel;
};

export const sysFields: TsysFields = {
  user: {
    password: 'password',
    email: 'email',
    confirmEmail: 'confirmEmail',
    age: 'age',
    role: 'role',
  },
  task: {
    title: 'title',
    content: 'content',
    list: 'list',
    owner: 'owner',
    deadline: 'deadline',
    completed: 'completed',
    attachments: 'attachments',
  },
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

export const workspaceVisibility: { public: string; private: string } = {
  public: 'Public',
  private: 'Private',
};
