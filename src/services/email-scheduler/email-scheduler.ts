import schedule from 'node-schedule';
import { Application } from '../../declarations';
import { EmailService } from '../../utils/email/emailService';

export function sendMail(app: Application) {
  const emailService = new EmailService(app);
  schedule.scheduleJob('0 23 * * *', async () => {
    
    const members = await app.service('users')._find({
      query: {
        role: 'member',
        deleted_at: null,
        $select: ['id', 'email'],
      },
      paginate: false,
    });

    members.forEach(async (member: { id: string; email: string }) => {
      const selectQuery = `
      SELECT 
          P.NAME AS "project",
          SUM(AL.DURATION)::TIME AS "time_spent_by_member",
          ROUND(AVG((EXTRACT(EPOCH FROM (AL.DURATION - AL.IDLE_TIME)) / EXTRACT(EPOCH FROM AL.DURATION))) * 100) AS "average_activity_percentage"
      FROM 
          "ACTIVITY_LOG" AL
      LEFT JOIN 
          "PROJECT" P ON P.ID = AL.FK_PROJECT
      WHERE 
          AL.FK_USER = '${member.id}'
          AND AL.DATE = CURRENT_DATE
          AND AL.DELETED_AT IS NULL
      GROUP BY 
          P.NAME
      ORDER BY 
          P.NAME ASC;
      `;
      const sequelize = app.get('sequelizeClient');
      const [select, tempSelect] = await sequelize.query(selectQuery);

      if (select.length) {
        const totalProjectWorked = select.length;
        const totalSeconds = select.reduce((acc: any, cur: any) => {
          const [hours, minutes, seconds] = cur.time_spent_by_member
            .split(':')
            .map(Number);
          return acc + hours * 3600 + minutes * 60 + seconds;
        }, 0);

        const totalTimeSpent = new Date(totalSeconds * 1000)
          .toISOString()
          .substring(11, 19);
        
        const sumActivityPercentage = select.reduce(
          (acc: any, cur: any) => acc + Number(cur.average_activity_percentage),
          0
        );

        const averageActivity = sumActivityPercentage / select.length;

        const date = new Date();

        let text = `Date: ${date.toLocaleDateString()}\n\nTotal Project worked: ${totalProjectWorked}.\nTotal Time Spent: ${totalTimeSpent}.\nActivity: ${averageActivity}%.\n\nProject List | Time Spent | Activity:\n`;

        select.forEach((activity: any) => {
          text = text + `\n${activity.project} | ${activity.time_spent_by_member} | ${activity.average_activity_percentage}%\n`;
        });

        emailService.sendMail({
          to: member.email,
          subject: 'Activity Tracker | Daily Email',
          text: text
        });
      }
    });
  });
}
