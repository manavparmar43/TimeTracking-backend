import { Application } from '../declarations';
import users from './users/users.service';
import project from './project/project.service';
import projectMember from './project-member/project-member.service';
import client from './client/client.service';
import todo from './todo/todo.service';
import projectGetMyProjects from './project/get-my-projects/get-my-projects.service';
import activityLog from './activity-log/activity-log.service';
import screenshot from './screenshot/screenshot.service';
import analysis from './analysis/analysis.service';
import lookup from './lookup/lookup.service';
import exportCsv from './export-csv/export-csv.service';
import widgets from './widgets/widgets.service';
import urls from './urls/urls.service';
import usersProfile from './users/profile/profile.service';
import usersGetUsers from './users/get-users/get-users.service';
import exportCsvDownload from './export-csv/download/download.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(usersProfile);
  app.configure(usersGetUsers);
  app.configure(users);
  app.configure(projectGetMyProjects);
  app.configure(project);
  app.configure(projectMember);
  app.configure(client);
  app.configure(todo);
  app.configure(activityLog);
  app.configure(screenshot);
  app.configure(analysis);
  app.configure(lookup);
  app.configure(exportCsvDownload);
  app.configure(exportCsv);
  app.configure(widgets);
  app.configure(urls);
}
