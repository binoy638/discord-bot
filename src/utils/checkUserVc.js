module.exports = (voiceChannelMembers, id) => {
  let isUserInVC = false;
  voiceChannelMembers.map((member) => {
    if (member.user.id === id) {
      isUserInVC = true;
    }
  });
  return isUserInVC;
};
