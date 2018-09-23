module.exports = {
  criteria:[
    {
      id: 'percentageOfUsers',
      check: function(user, percent) {
        return (user.id % 100 < percent * 100);
      }
    },
  ],
  features:[
    // {
    //   id: 'seeTransactions',
    //   criteria: { percentageOfUsers: 0.10 }
    // },
  ]
};
