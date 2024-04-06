module.exports = {
  name: "ready",
  once: "true",
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}.`);
    const statusMessages = [
      "Hopping on that Lite.",
      "with Jerbs Antlers.",
      "with Cow's Hooves.",
      "MCCI with sweats.",
    ];

    let currentStatus = 0;

    const updateBotStatus = () => {
      console.log(`Status set to ${statusMessages[currentStatus]}`);

      client.user.setActivity(statusMessages[currentStatus], {
        type: "PLAYING",
      });
      currentStatus = (currentStatus + 1) % statusMessages.length;
    };

    updateBotStatus();
    setInterval(updateBotStatus, 45000);
  },
};
