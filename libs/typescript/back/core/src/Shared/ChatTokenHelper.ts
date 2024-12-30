// TODO: Check if this is a good place to put this
export class ChatTokenHelper {
  static getUserIdsByChatToken(chatToken: string): string[] {
    try {
      // TODO: create a chatToken type
      const chatTokenObj = JSON.parse(chatToken) as { userIds: string[] };
      return chatTokenObj.userIds;
    } catch (error) {
      console.error(
        'getUserIdsFronChatToken - Error parsing chatToken: ' + chatToken
      );

      return [];
    }
  }

  static getChatTokenByUserIds(userIds: string[]): string {
    return JSON.stringify({ userIds });
  }
}
